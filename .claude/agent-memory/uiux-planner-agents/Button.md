---
name: Button 명세 변경 이력
description: Button color 축 gray 추가 — 기존 secondary(회색)를 gray로 분리, secondary를 sky-blue 계열로 재정의
type: project
---

## 변경 내용 (2026-04-27)

`ButtonColor` 타입에 `gray` variant 추가됨.

| color | 설명 |
|-------|------|
| primary | 주요 CTA — 브랜드 cyan 배경, 흰 텍스트 |
| secondary | 브랜드 보조 CTA — sky-blue 배경(`$bg-accent-sky-blue`), 브랜드 cyan 텍스트(`$color-primary-hover`) |
| gray | 중성 보조 액션 — 기존 secondary와 동일한 회색 계열(`$bg-secondary` 배경, `$text-800` 텍스트) |
| black | 강조 단일 액션 |

**Why:** Figma에서 secondary 버튼이 sky-blue 계열로 디자인 변경됨. 기존 회색 보조 버튼 용도는 gray로 분리 유지.

**How to apply:** 새 spec/구현 작업에서 취소/뒤로가기 보조 버튼은 `gray`, 브랜드 연계 부드러운 CTA는 `secondary` 사용.
