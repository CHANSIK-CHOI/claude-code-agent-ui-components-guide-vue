<template>
  <div class="claudeGuide">
    <header class="claudeGuide__hero">
      <p class="claudeGuide__heroEyebrow">Frameout Pub</p>
      <h1 class="claudeGuide__heroTitle">Claude 컴포넌트 제작 워크플로우</h1>
      <p class="claudeGuide__heroDesc">
        이 페이지는 Claude Code(Anthropic의 터미널 기반 코딩 어시스턴트)를 활용해 구축한 컴포넌트 자동화 워크플로우를 정리한 가이드입니다.
        React 경력으로 Vue를 처음 다루는 퍼블리셔가 일관된 마크업·접근성·디자인 토큰 품질을 유지할 수 있도록,
        컴포넌트 한 개를 만들 때 필요한 단계(명세 작성 → SFC 구현 → 가이드 페이지 → 라이브러리·메커니즘 검수)를 4개의 전문 에이전트가 역할 분담합니다.
        검수에서 이슈가 발견되면 자동 분기 루프백으로 결함이 발생한 영역의 에이전트만 재실행해 보정합니다.
      </p>
      <ul class="claudeGuide__heroStack">
        <li>Vue 3.4</li>
        <li>Nuxt 3.10</li>
        <li>TypeScript</li>
        <li>SCSS / Atomic Design</li>
        <li>Radix Vue (Stable only)</li>
      </ul>
    </header>

    <section class="claudeGuide__section">
      <div class="claudeGuide__sectionHead">
        <span class="claudeGuide__sectionIndex">01</span>
        <h2 class="claudeGuide__sectionTitle">컴포넌트 제작 9대 원칙</h2>
        <p class="claudeGuide__sectionDesc">
          컴포넌트를 어떻게 만들어야 하는가에 대한 저의 개인적인 철학입니다.
          Claude는 이 원칙들을 일관되게 실행하는 도구입니다 — 무엇을 만들지는 이미 결정되어 있고, Claude는 그 결정을 코드로 옮깁니다.
        </p>
      </div>

      <div class="claudeGuide__principleGrid">
        <article
          v-for="(principle, idx) in principles"
          :key="principle.title"
          class="claudeGuide__principleCard"
        >
          <span class="claudeGuide__principleNumber">{{ String(idx + 1).padStart(2, '0') }}</span>
          <h3 class="claudeGuide__principleTitle">{{ principle.title }}</h3>
          <p class="claudeGuide__principleDesc">{{ principle.desc }}</p>
          <ul class="claudeGuide__principleList">
            <li v-for="item in principle.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="claudeGuide__section">
      <div class="claudeGuide__sectionHead">
        <span class="claudeGuide__sectionIndex">02</span>
        <h2 class="claudeGuide__sectionTitle">에이전트 카탈로그</h2>
        <p class="claudeGuide__sectionDesc">
          에이전트는 Claude Code의 sub-agent — 특정 역할만 수행하도록 격리된 실행 단위입니다.
          각 에이전트는 자신의 역할 범위 밖 파일은 절대 수정하지 않으며, 검수 에이전트(qa·reviewer)는 코드 수정 권한 자체가 없어 권고만 작성합니다(실제 수정은 publisher가 담당).
        </p>
      </div>

      <div class="claudeGuide__agentGrid">
        <article
          v-for="agent in agents"
          :key="agent.name"
          class="claudeGuide__agentCard"
          :data-tone="agent.tone"
        >
          <header class="claudeGuide__agentHead">
            <span class="claudeGuide__agentDot"></span>
            <h3 class="claudeGuide__agentName">{{ agent.name }}</h3>
            <span class="claudeGuide__agentBadge">{{ agent.badge }}</span>
          </header>
          <p class="claudeGuide__agentRole">{{ agent.role }}</p>

          <dl class="claudeGuide__agentBlock">
            <dt>담당</dt>
            <dd>
              <ul>
                <li v-for="item in agent.does" :key="item">{{ item }}</li>
              </ul>
            </dd>
          </dl>

          <dl class="claudeGuide__agentBlock">
            <dt>비담당</dt>
            <dd>
              <ul>
                <li v-for="item in agent.doesnt" :key="item">{{ item }}</li>
              </ul>
            </dd>
          </dl>

          <footer class="claudeGuide__agentFooter">
            <span class="claudeGuide__agentLabel">산출물</span>
            <code>{{ agent.output }}</code>
          </footer>
        </article>
      </div>
    </section>

    <section class="claudeGuide__section">
      <div class="claudeGuide__sectionHead">
        <span class="claudeGuide__sectionIndex">03</span>
        <h2 class="claudeGuide__sectionTitle">워크플로우</h2>
        <p class="claudeGuide__sectionDesc">
          신규 컴포넌트는 1~6단계 전체를, 기존 컴포넌트는 검수 단계(4·5)만 단독 실행할 수 있습니다.
          1단계는 plan 모드(읽기·계획만 가능)에서 진행되며, 사용자가 명세를 승인한 직후 <code>Shift+Tab</code>으로 accept 모드(파일 쓰기 가능)로 수동 전환하면 2단계 이후가 자동 진행됩니다 — Claude Code는 명령 내부에서 mode 전환을 자동화할 수 없어 이 한 번의 수동 조작이 필요합니다.
        </p>
      </div>

      <ol class="claudeGuide__flow">
        <li v-for="(step, idx) in flow" :key="step.title" class="claudeGuide__flowStep" :data-tone="step.tone">
          <div class="claudeGuide__flowMarker">
            <span class="claudeGuide__flowNumber">{{ String(idx + 1).padStart(2, '0') }}</span>
          </div>
          <div class="claudeGuide__flowBody">
            <h3 class="claudeGuide__flowTitle">{{ step.title }}</h3>
            <p class="claudeGuide__flowAgent">{{ step.agent }}</p>
            <p class="claudeGuide__flowDesc">{{ step.desc }}</p>
            <p v-if="step.mode" class="claudeGuide__flowMode">{{ step.mode }}</p>
          </div>
        </li>
      </ol>

      <aside class="claudeGuide__loopback">
        <h3 class="claudeGuide__loopbackTitle">루프백 분기 정책</h3>
        <ul class="claudeGuide__loopbackList">
          <li><strong>spec 자체 결함</strong> — planner부터 다시 실행</li>
          <li><strong>구현 영역 결함</strong> — publisher만 다시 실행</li>
          <li><strong>시니어 리뷰 영역</strong> — 항상 publisher만 실행 (spec 영역 아님)</li>
          <li><strong>최대 2회 루프</strong> — 초과 시 사용자 개입 요청으로 종료</li>
        </ul>
      </aside>
    </section>

    <section class="claudeGuide__section">
      <div class="claudeGuide__sectionHead">
        <span class="claudeGuide__sectionIndex">04</span>
        <h2 class="claudeGuide__sectionTitle">커맨드</h2>
        <p class="claudeGuide__sectionDesc">
          슬래시 커맨드(<code>/</code>로 시작하는 단축 명령)는 4개 에이전트와 사용자 승인 절차를 한 줄로 묶어 호출합니다.
          사용자가 4개 에이전트를 직접 순서대로 호출할 필요 없이, 커맨드 한 번으로 전체 워크플로우(루프백 포함)가 실행됩니다.
        </p>
      </div>

      <div class="claudeGuide__commandGrid">
        <article
          v-for="cmd in commands"
          :key="cmd.name"
          class="claudeGuide__commandCard"
        >
          <header class="claudeGuide__commandHead">
            <code class="claudeGuide__commandName">{{ cmd.name }}</code>
            <span class="claudeGuide__commandPurpose">{{ cmd.purpose }}</span>
          </header>
          <p class="claudeGuide__commandDesc">{{ cmd.desc }}</p>
          <ol class="claudeGuide__commandSteps">
            <li v-for="step in cmd.steps" :key="step">{{ step }}</li>
          </ol>
        </article>
      </div>
    </section>

    <section class="claudeGuide__section">
      <div class="claudeGuide__sectionHead">
        <span class="claudeGuide__sectionIndex">05</span>
        <h2 class="claudeGuide__sectionTitle">이슈 등급 정책</h2>
        <p class="claudeGuide__sectionDesc">검수 에이전트가 발견한 이슈는 3단계로 분류되어 처리 방식이 달라집니다.</p>
      </div>

      <div class="claudeGuide__severityGrid">
        <article
          v-for="severity in severities"
          :key="severity.level"
          class="claudeGuide__severityCard"
          :data-level="severity.level"
        >
          <header class="claudeGuide__severityHead">
            <span class="claudeGuide__severityLevel">{{ severity.level }}</span>
            <span class="claudeGuide__severityAction">{{ severity.action }}</span>
          </header>
          <p class="claudeGuide__severityDesc">{{ severity.desc }}</p>
          <ul class="claudeGuide__severityExamples">
            <li v-for="ex in severity.examples" :key="ex">{{ ex }}</li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'guide' })

interface Agent {
  name: string
  role: string
  badge: string
  tone: 'planner' | 'publisher' | 'qa' | 'reviewer'
  does: string[]
  doesnt: string[]
  output: string
}

interface FlowStep {
  title: string
  agent: string
  desc: string
  mode?: string
  tone: 'planner' | 'publisher' | 'guide' | 'qa' | 'reviewer' | 'final'
}

interface Command {
  name: string
  purpose: string
  desc: string
  steps: string[]
}

interface Principle {
  title: string
  desc: string
  items: string[]
}

interface Severity {
  level: 'BLOCKER' | 'WARN' | 'INFO'
  action: string
  desc: string
  examples: string[]
}

const agents: Agent[] = [
  {
    name: 'uiux-planner-agents',
    role: '컴포넌트 명세 작성 + 디자인 토큰 매핑 통합 담당',
    badge: '기획',
    tone: 'planner',
    does: [
      'Atomic 계층 / Base·Wrapper 분리 판단',
      'Props / State / Variant / 접근성 요구사항 정의',
      'Figma 시각값 ↔ 시맨틱 토큰 매핑',
    ],
    doesnt: [
      '코드 / 타입 / SCSS 수치 작성',
      '구현 파일 (.vue, .ts, .scss) 수정',
    ],
    output: '.claude/specs/[Name].md',
  },
  {
    name: 'uiux-publisher-agents',
    role: 'spec 기준 Vue SFC 구현 (마크업·BEM·스타일·접근성)',
    badge: '퍼블',
    tone: 'publisher',
    does: [
      'spec 기준 Vue SFC 작성',
      'BEM + scoped SCSS + 토큰 적용',
      '$attrs 위임 / Radix Vue 3단계 분배',
    ],
    doesnt: [
      'API 연동 ($fetch/useQuery/axios)',
      'spec 없는 임의 구현',
      'Figma에 없는 시각 처리 임의 적용',
    ],
    output: 'components/{layer}/[Name].vue',
  },
  {
    name: 'uiux-qa-agents',
    role: 'Context7로 라이브러리 사실 체크 + Playwright로 화면 동작 검증',
    badge: '검수',
    tone: 'qa',
    does: [
      'Radix Vue / DatePicker API 팩트체크',
      '가이드 페이지 실제 인터랙션 검증',
      '키보드 / 접근성 / 콘솔 에러 확인',
    ],
    doesnt: [
      '코드 직접 수정',
      'Vue 메커니즘 평가 (시니어 영역)',
      'dev server 자체 기동',
    ],
    output: '검수 보고서 (대화창)',
  },
  {
    name: 'vue-senior-reviewer-agents',
    role: 'Composition API 관용구 + 복잡도 검토. 권고만 작성',
    badge: '리뷰',
    tone: 'reviewer',
    does: [
      'watch / computed 적절성 진단',
      'props mutation / 반응성 누수 검출',
      '복잡도·중첩·중복 로직 식별',
    ],
    doesnt: [
      '코드 직접 수정 (publisher가 실행)',
      'spec / 라이브러리 사실 체크',
    ],
    output: '리뷰 보고서 (현재/권고/이유 3단)',
  },
]

const flow: FlowStep[] = [
  {
    title: '명세 작성',
    agent: 'uiux-planner-agents',
    desc: '컴포넌트의 Props·State·Variant·접근성을 한국어 명세로 산출. Figma 디자인을 토큰에 매핑.',
    mode: '플랜 모드 — 사용자 승인 후 저장',
    tone: 'planner',
  },
  {
    title: '구현',
    agent: 'uiux-publisher-agents',
    desc: 'spec을 기준으로 Vue SFC 작성. flat 폴더 구조, $b 변수 BEM, $attrs 위임 패턴 적용.',
    mode: 'accept 모드 — 1단계 승인 직후 Shift+Tab으로 수동 전환',
    tone: 'publisher',
  },
  {
    title: '가이드 페이지',
    agent: 'uiux-publisher-agents',
    desc: 'pages/guide/[name]/index.vue 작성. Props/Slots/Events 표 + 위임 안내 단락 + Radix 안내 단락.',
    mode: 'accept 모드 — /component-create 흐름에서 사용자 추가 확인 없이 자동 작성',
    tone: 'guide',
  },
  {
    title: 'QA 검수',
    agent: 'uiux-qa-agents',
    desc: 'Context7으로 라이브러리 API 정확성 확인 + Playwright로 가이드 페이지 실제 동작 검증.',
    mode: 'BLOCKER 시 자동 분기 루프백',
    tone: 'qa',
  },
  {
    title: 'Vue 시니어 리뷰',
    agent: 'vue-senior-reviewer-agents',
    desc: 'Composition API 관용구·복잡도 검토. 발견 이슈는 권고로 작성, publisher가 수정 실행.',
    mode: 'WARN은 사용자 확인 후 결정',
    tone: 'reviewer',
  },
  {
    title: '완료 보고',
    agent: '워크플로우 종합',
    desc: '구현·가이드·검수 결과 요약. 무시한 INFO/WARN 항목 표시 (향후 개선 참고용).',
    tone: 'final',
  },
]

const commands: Command[] = [
  {
    name: '/component-create [Name]',
    purpose: '신규 컴포넌트',
    desc: '명세 작성부터 검수까지 전체 워크플로우를 한 줄로 실행합니다. 1단계는 plan 모드에서 명세 초안을 출력만 하며 사용자 승인을 기다리고, 승인 직후 사용자가 Shift+Tab으로 accept 모드로 전환하면 2~6단계(구현·가이드·검수·루프백·완료 보고)가 자동 진행됩니다.',
    steps: [
      '0. 사전 확인 (spec 존재 시 1단계 건너뛰기)',
      '1. 명세 작성 [plan 모드] — planner는 출력만, 사용자 승인 후 명령이 .claude/specs/[Name].md에 저장',
      '2. Vue SFC 구현 + 카테고리 index.ts barrel export 1줄 추가 (사용처에서 카테고리 단위로 import)',
      '3. 가이드 페이지 작성 (사용자 추가 확인 없이 자동 진행 — publisher 단독 호출 시에는 반대로 사용자 확인 필수)',
      '4. QA 검수 → 시니어 리뷰 (이슈 시 자동 루프백)',
      '5. 완료 보고',
    ],
  },
  {
    name: '/component-audit [Name]',
    purpose: '기존 컴포넌트 검수',
    desc: '이미 만들어진 컴포넌트만 검수합니다. .claude/specs/*.md가 없으면 reverse-mode로 진입 — planner가 .vue 코드를 읽어 Props·State·Variant·접근성 항목을 명세 형식으로 역추출하고, 사용자가 승인하면 명령이 .claude/specs/[Name].md에 저장한 뒤 본 검수를 시작합니다. (planner는 reverse-mode에서도 코드 수정은 하지 않으며 읽기 전용으로만 동작합니다.)',
    steps: [
      '0. 사전 확인 (spec 부재 시 reverse-mode — 코드 → 명세 역추출 후 저장)',
      '1. QA 검수 (Context7 + Playwright)',
      '2. Vue 시니어 리뷰',
      '3. 루프백 (BLOCKER 시 자동 분기, 최대 2회)',
      '4. WARN 처리 (사용자 확인)',
      '5. 완료 보고',
    ],
  },
]

const principles: Principle[] = [
  {
    title: '명세 우선 (Spec-First)',
    desc: '코드는 명세를 실행하는 수단이다. 무엇을 만들지 결정한 뒤 비로소 어떻게 만들지를 이야기한다. Claude는 이미 결정된 것을 구현하는 도구이지, 무엇을 만들지를 제안하는 역할이 아니다.',
    items: [
      'spec 없이 구현 시작 안 함',
      'spec 변경 시 .claude/specs/*.md 현행화 의무',
      'spec과 구현 불일치 = BLOCKER',
    ],
  },
  {
    title: 'Atomic Design + Flat 구조',
    desc: '컴포넌트는 역할만큼만 존재한다. atoms는 어떤 다른 컴포넌트에도 의존하지 않는다. Flat 구조는 "이 파일은 어디 있지?"라는 질문을 없앤다 — 파일은 항상 카테고리 바로 아래, 단 한 단계 깊이에 있다.',
    items: [
      'atoms → molecules → organisms 단방향',
      '컴포넌트별 하위 폴더 없이 .vue 평탄 배치',
      '카테고리 단위 index.ts barrel만',
      'Base·Wrapper 분리는 다음 원칙 참조',
    ],
  },
  {
    title: 'Base / Wrapper 로직 분리',
    desc: '공통 로직은 Base 하나에 응집한다. Wrapper는 Base를 import해서 추가 기능만 붙인다. Wrapper가 Base의 v-model·에러 표시·$attrs 위임을 다시 구현하는 순간 둘 사이의 계약이 깨진다 — 공통 로직 변경 시 Base만 수정하면 되는 이점이 사라진다.',
    items: [
      'v-model / error / disabled / $attrs 위임 → Base 책임',
      '검색 버튼 / 비밀번호 토글 등 추가 요소 → Wrapper 책임',
      'Wrapper는 <Base v-model="..." :error="..." v-bind="$attrs" /> 형태만',
      'Wrapper에서 Base 공통 로직 재구현 금지',
      'Base·Wrapper 같은 카테고리 폴더 평탄 배치',
    ],
  },
  {
    title: 'Vue Composition API 관용구',
    desc: 'Vue가 제공하는 방식대로 Vue를 쓴다. <script setup>은 장식이 아니라 Vue 3의 표준 관용구다. inheritAttrs를 끄고 $attrs를 핵심 요소에 수동으로 위임하는 건 설계 결정이다 — 컴포넌트가 네이티브 HTML 속성을 완전히 수용하게 만든다.',
    items: [
      '<script setup lang="ts">만 — Options API 금지',
      'defineOptions({ inheritAttrs: false }) + v-bind="$attrs" 모든 컴포넌트 필수',
      'v-bind="$attrs"는 핵심 요소에 / 명시 바인딩보다 먼저',
      'watch 남용 금지 — 파생값은 computed',
      'props mutation 금지',
    ],
  },
  {
    title: 'BEM + 토큰 스타일',
    desc: '이름은 관계를 말한다. BEM은 HTML 구조와 CSS 선택자의 관계를 명시적으로 드러낸다. 토큰은 "이 색은 무슨 색인가"가 아닌 "이 색은 어떤 역할인가"를 묻는다. raw hex는 프로젝트 어디에도 없다.',
    items: [
      '<style lang="scss" scoped> 필수',
      '$b: \'name\' 블록 변수 패턴',
      '3뎁스 이상 중첩 금지 (pseudo만 예외)',
      'rem 단위 (html { font-size: 10px })',
      'raw hex / 타이포 수치 직접 사용 금지',
    ],
  },
  {
    title: '레이아웃 원칙',
    desc: '컴포넌트는 자신의 너비를 결정하지 않는다. 컨테이너가 결정한다. 이 원칙 하나가 컴포넌트 간 레이아웃 충돌을 없앤다. width: 100%는 기본값이고, 예외에는 반드시 이유가 있어야 한다.',
    items: [
      'display: flex; width: 100% 기본',
      '부모가 너비 결정',
      'inline-flex / fit-content / 고정 width 금지',
      'fullWidth / centered 같은 레이아웃 prop 추가 금지',
    ],
  },
  {
    title: '외부 라이브러리',
    desc: 'Alpha는 쓰지 않는다. 기반이 흔들리는 위에 무언가를 짓지 않는다. API를 기억으로 쓰지 않는다 — 기억은 틀리고, Context7은 현재 문서를 읽는다. 잘 모를 때 확인하는 것이 자신감 있는 개발이다.',
    items: [
      'Radix Vue Stable만 (Alpha 금지)',
      '날짜는 @vuepic/vue-datepicker',
      '3단계 위임 (Root / Trigger / Content)',
      '사용 전 Context7 MCP로 사실 확인',
    ],
  },
  {
    title: '접근성 (a11y)',
    desc: '접근성은 추가하는 기능이 아니라 처음부터 올바르게 만드는 것이다. <button>은 키보드·포커스·스크린 리더를 자동으로 처리한다. 올바른 HTML을 쓰는 것이 가장 효율적인 접근성 구현이다.',
    items: [
      '시맨틱 HTML 우선 (button / a / label)',
      '아이콘 버튼은 aria-label 필수',
      '클릭 차단 = 이중 차단 (속성 + early return)',
      ':focus-visible 대체 스타일 필수',
      '대비 4.5:1, 색상만으로 상태 표현 금지',
    ],
  },
  {
    title: 'Figma 충실도',
    desc: '디자인에 없는 것은 존재하지 않는다. Figma는 시각 결정의 단일 출처다. 좋아 보인다는 이유로 임의 적용하는 것은 디자인 의도를 무력화한다. 필요하다고 판단되면 먼저 확인한다.',
    items: [
      'Figma에 없는 시각 처리 임의 적용 금지',
      '디자인에 없으면 명세에도 안 넣음',
      '필요하다고 판단되면 사용자 확인 먼저',
    ],
  },
  {
    title: '역할 분리',
    desc: '퍼블리셔는 마크업·스타일·접근성을 책임진다. API 연동·비즈니스 로직은 개발자 영역이다. 이 경계가 명확할수록 핸드오프가 쉽고 유지보수가 단순해진다. Claude도 이 경계를 넘지 않는다.',
    items: [
      '퍼블리셔 영역: 마크업·스타일·접근성·더미 데이터',
      '개발자 영역(작성 금지): $fetch / useQuery / Zod / 환경변수',
      '연동 위치는 // [연동] 주석 + 핸드오프 테이블',
      '검수 에이전트는 권고만, 수정은 publisher',
    ],
  },
]

const severities: Severity[] = [
  {
    level: 'BLOCKER',
    action: '자동 루프백',
    desc: '반드시 해결해야 하는 명백한 결함. 검수 에이전트가 자동으로 planner 또는 publisher를 재호출합니다.',
    examples: [
      '존재하지 않는 라이브러리 prop 사용',
      '콘솔 에러 / 키보드 접근 불가',
      'spec 명시 variant 미구현',
      'props mutation / 반응성 누수',
      'Alpha 컴포넌트 사용',
    ],
  },
  {
    level: 'WARN',
    action: '사용자 확인',
    desc: '품질 개선 권고. BLOCKER 없으면 PASS 후 사용자에게 "수정할지 / 무시할지" 묻습니다.',
    examples: [
      '시각적 미세 차이 (Figma 대비)',
      '불필요한 watch (computed로 대체 가능)',
      '중첩 깊이 4단계 이상',
      '권장 패턴 미준수',
    ],
  },
  {
    level: 'INFO',
    action: '보고만',
    desc: '향후 개선 참고용. 처리 강제 없음. 보고서에만 기록되고 작업은 종료됩니다.',
    examples: [
      '명명 / 가독성 제안',
      '마이크로 스타일 최적화',
      'composable 추출 후보 (1회만 발생)',
    ],
  },
]
</script>

<style lang="scss" scoped src="./index.scss"></style>
