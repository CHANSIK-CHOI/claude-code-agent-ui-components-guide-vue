## 자동화 hook 규칙 (타입체크 / Prettier 포맷)

컴포넌트 작업 후 타입 에러·포맷 누락을 사람 손이 아니라 hook 으로 자동 검증한다. 설정 위치는 `.claude/settings.json` 의 `hooks` 블록, 스크립트는 `.claude/hooks/*.sh` (bash — macOS 환경) 다.

> React 비교: husky + lint-staged 로 커밋 전 prettier/tsc 를 강제하던 것과 같은 발상이다. 본 프로젝트는 git hook 대신 **Claude Code hook**(PostToolUse / Stop)으로 작업 흐름에 붙였다.

---

### 1. Prettier 자동 포맷 (항상 ON, 비차단)

| 항목      | 값                                                                           |
| --------- | ---------------------------------------------------------------------------- |
| 스크립트  | `.claude/hooks/format-on-edit.sh`                                            |
| hook 타입 | `PostToolUse` (matcher `Edit\|Write`)                                        |
| 대상      | 편집된 `.vue` / `.ts` / `.tsx` / `.js` / `.mjs` / `.json` / `.scss` / `.css` |
| 동작      | 해당 파일을 `prettier --write --ignore-unknown` 으로 즉시 포맷               |
| exit      | 항상 0 (작업을 막지 않는다)                                                  |

- `.prettierignore`(node_modules/.nuxt/.output/dist 등)는 prettier 가 알아서 거른다.
- 토글 없음 — 항상 동작한다.
- **주의**: 포맷이 파일을 바꾸면, 직후 같은 파일을 Edit 할 때 "file modified since read" 가 날 수 있다 → 재 Read 후 진행한다 (정상 동작).

---

### 2. 타입체크 (토글 방식, 기본 OFF)

| 항목           | 값                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------- |
| 스크립트       | `.claude/hooks/typecheck.sh`                                                             |
| hook 타입      | `Stop` (timeout 180s)                                                                    |
| 토글 플래그    | `.claude/hooks/.typecheck-on` — **존재 시에만** 검사. 없으면 즉시 통과(기본 OFF, opt-in) |
| 검사 명령      | `npx vue-tsc --noEmit` (프로젝트 전체 컴파일)                                            |
| 검사 범위      | git working tree 에서 변경된 `**/*.{ts,tsx,vue}` 파일의 에러만 필터                      |
| 에러 시        | `exit 2` + stderr 로 Claude 에 되먹임 → Claude 가 수정 후 재종료 시도                    |
| 무한 루프 가드 | `.typecheck-attempts` 카운터로 최대 3회까지만 차단, 이후 경고만 남기고 통과              |

**왜 전체 컴파일 후 필터인가**: `vue-tsc` 는 import 그래프 전체를 하나의 프로그램으로 컴파일하므로 일부 폴더만 따로 컴파일하는 격리는 불가능하다. `tsconfig` 의 `include` 를 좁히면 Nuxt auto-import 타입이 누락돼 거짓 에러가 폭증한다. 그래서 전체를 돌리되 **출력에서 이번에 변경된 파일 경로의 에러만** 추출한다 — 작업과 무관한 기존 에러는 무시된다.

**왜 변경 파일만인가**: 프로젝트에는 작업과 무관한 기존 타입 에러가 존재할 수 있어, 전체를 잡으면 매 종료마다 무관한 에러로 막힌다. git 변경 파일로 좁혀 "이번에 만든 코드"의 에러만 잡는다. (단 커밋 후엔 해당 파일이 변경 목록에서 빠진다)

#### 켜기 / 끄기

| 동작 | 방법                                                                                                     |
| ---- | -------------------------------------------------------------------------------------------------------- |
| 켜기 | "타입체크 켜줘" → Claude 가 `.claude/hooks/.typecheck-on` 파일 생성 (내용 무관). 또는 사용자가 직접 생성 |
| 끄기 | "타입체크 꺼줘" → 그 파일 삭제. 또는 사용자가 직접 삭제                                                  |

`npm run typecheck` 로 언제든 수동 전체 타입체크도 가능하다 (`package.json` 스크립트).

---

### 3. 문서 동기화 안내 hook

| 스크립트 | hook 타입 | 동작 |
| --- | --- | --- |
| `.claude/hooks/detect-claude-changes.sh` | `PostToolUse` (matcher `Edit\|Write`) | `.claude/rules\|agents\|commands/*.md` 변경 시 `.docs-dirty` 플래그에 경로 기록 |
| `.claude/hooks/notify-docs-sync.sh` | `Stop` | `.docs-dirty` 존재 시 변경 파일 목록과 `/sync-docs` 실행 안내 출력 후 플래그 삭제 |

---

### 4. 스크립트 작성 주의 (bash)

- 모든 hook 스크립트는 **bash** 로 작성하고 실행 권한(`chmod +x`)을 부여한다.
- stdin JSON 파싱은 `jq` 의존 없이 **node 원라이너**로 처리한다 (프로젝트에 node 필수 존재). 패턴은 `format-on-edit.sh` 참조.
- 한글 출력은 macOS 기본 UTF-8 환경에서 별도 처리 불필요.
- PostToolUse 훅은 차단 훅이 아니다 — 어떤 실패도 `exit 0` 으로 삼킨다. 차단이 필요한 검사는 Stop 훅 + `exit 2` 만 사용한다.

---

### 5. 의존성

- `vue-tsc`, `typescript` (devDependencies) — 타입체크용
- `prettier` (기존 설치) — 포맷용
