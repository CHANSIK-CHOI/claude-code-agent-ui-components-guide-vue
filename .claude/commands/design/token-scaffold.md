---
description: "피그마 두 링크에서 colors/typography 토큰을 추출해 design-tokens.json 생성"
---

> 본 명령은 에이전트를 호출하지 않고 Claude 가 Figma MCP 를 직접 호출해 토큰을 추출·저장한다.

## 사용법

/design:token-scaffold

## 피그마 참조 (단일 출처)

fileKey와 노드 ID는 `.claude/CLAUDE.md`의 **프로젝트 외부 리소스 → Figma** 섹션을 단일 출처로 참조한다. 본 명령은 `Colors` 노드와 `Typography` 노드를 사용한다.

## 프로세스

1. CLAUDE.md의 Colors/Typography 노드 두 곳 모두 Figma MCP로 접근 시도
   - 어느 하나라도 실패 → **즉시 중단**, 아래 메시지 출력 후 이후 단계 진행하지 않음

```
❌ 피그마 링크 접속 실패: [실패한 URL]
토큰 추출을 중단합니다. 피그마 로그인 상태 또는 링크를 확인해주세요.
```

2. 두 링크 접속 성공 시 아래 토큰 항목만 추출
3. `design-tokens.json` 생성

## 출력 파일

- 파일명: `design-tokens.json` (고정)
- 위치: 프로젝트 루트

## 추출 토큰 범위

### Color

- `primary` — 브랜드 메인 색상
- `gray` — 중립 스케일 (100~900)
- `line` - 100 ~ 300
- `accent` — 강조 색상

### Typography

- heading (h1~h5)
- body (body1~body5)
- caption (1~3)

- `font-family`
- `font-size`
- `font-weight`

## 출력 JSON 형식 예시

```json
{
  "color": {
    "primary": { "value": "...", "type": "color" },
    "gray": {
      "100": { "value": "...", "type": "color" }
      // ...
    },
    "accent": { "value": "...", "type": "color" }
  },
  "typography": {
    "heading": {
      "h1": {
        "font-size": { "value": "...", "type": "dimension" },
        "font-weight": { "value": "...", "type": "fontWeight" }
      }
      // ...
    },
    "body": {
      "body1": {
        "font-size": { "value": "...", "type": "dimension" },
        "font-weight": { "value": "...", "type": "fontWeight" }
      }
      // ...
    },
    "caption": {
      "caption1": {
        "font-size": { "value": "...", "type": "dimension" },
        "font-weight": { "value": "...", "type": "fontWeight" }
      }
    }
  }
}
```

## 규칙

- 피그마 접속 실패 시 **즉시 중단** — 기본값 fallback 없음
- 추출 범위는 위 토큰 항목에만 한정, 범위 외 값은 포함하지 않음
- 네이밍 케밥케이스 유지
- 출력 완료 후 안내:
  "design-tokens.json 생성 완료. /design:token-scss 를 실행해 SCSS 변수로 변환하세요."
