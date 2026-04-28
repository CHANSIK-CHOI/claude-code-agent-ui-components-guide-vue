<template>
  <div class="pageList">
    <header class="pageList__header">
      <h1 class="pageList__title">드시모네몰 퍼블리싱 페이지 리스트</h1>
      <p class="pageList__desc">페이지별 작업 현황을 관리합니다.</p>
    </header>

    <section class="pageList__section">
      <table class="pageList__table">
        <thead>
          <tr>
            <th class="pageList__th pageList__th--name">페이지명</th>
            <th class="pageList__th">시작일자</th>
            <th class="pageList__th">종료일자</th>
            <th class="pageList__th pageList__th--days">작업 일수</th>
            <th class="pageList__th">담당자</th>
            <th class="pageList__th">진행상태</th>
            <th class="pageList__th">링크</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="page in pages" :key="page.name" class="pageList__row">
            <td class="pageList__td pageList__td--name">{{ page.name }}</td>
            <td class="pageList__td pageList__td--center">{{ formatDate(page.startDate) }}</td>
            <td class="pageList__td pageList__td--center">{{ formatDate(page.endDate) }}</td>
            <td class="pageList__td pageList__td--days">{{ calcDays(page.startDate, page.endDate) }}</td>
            <td class="pageList__td pageList__td--center">{{ page.assignee || '-' }}</td>
            <td class="pageList__td pageList__td--center">
              <span class="pageList__status" :data-status="page.status">{{ page.status }}</span>
            </td>
            <td class="pageList__td pageList__td--link">
              <a
                v-if="page.link"
                :href="page.link"
                target="_blank"
                rel="noopener noreferrer"
                class="pageList__link"
              >바로가기</a>
              <span v-else class="pageList__empty">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "guide" });

interface Page {
  name: string
  startDate: string
  endDate: string
  assignee: string
  status: '대기' | '진행중' | '완료' | '보류'
  link: string
}

const pages = ref<Page[]>([
  { name: '모바일 AS-IS 분석 및 공통 생성',                                                               startDate: '2026-04-23', endDate: '2026-04-30', assignee: '퍼블팀', status: '진행중', link: '' },
  { name: '상품 리스트 화면 - 유형별 UI 구성',                                                            startDate: '2026-05-04', endDate: '2026-05-06', assignee: '원지예', status: '대기',   link: '' },
  { name: '상품 리스트 화면 - 보기 방식 선택',                                                            startDate: '',           endDate: '',           assignee: '',       status: '대기',   link: '' },
  { name: '체험팩 리스트 화면 - 이벤트 페이지형 UI로 재구성',                                             startDate: '2026-05-04', endDate: '2026-05-08', assignee: '최찬식', status: '대기',   link: '' },
  { name: '상품 상세 화면 - 상품 상세 상단 영역 구매 전환 유도 구조 개선',                               startDate: '2026-05-11', endDate: '2026-05-15', assignee: '원지예', status: '대기',   link: '' },
  { name: '장바구니 - 정기구독 상품 구매 전환 유도 및 혜택 비교 UI 개선',                                startDate: '2026-05-11', endDate: '2026-05-12', assignee: '최찬식', status: '대기',   link: '' },
  { name: '주문/결제 - 사용자 의사결정 최적화를 위한 UI 개선',                                           startDate: '2026-05-13', endDate: '2026-05-14', assignee: '최찬식', status: '대기',   link: '' },
  { name: '결제완료 - 주문 완료 페이지의 혜택 체감 및 정기구독 유지 강화를 위한 UI 개선',                startDate: '2026-05-15', endDate: '2026-05-15', assignee: '최찬식', status: '대기',   link: '' },
  { name: '상품 상세 화면 - 정기구독 상품 상세페이지 진입 시 안내를 위한 코치마크 노출',                 startDate: '2026-06-22', endDate: '2026-06-22', assignee: '원지예', status: '대기',   link: '' },
  { name: '마이페이지 > 메인',                                                                             startDate: '2026-05-22', endDate: '2026-05-26', assignee: '원지예', status: '대기',   link: '' },
  { name: '마이페이지 > 나의 정기구독',                                                                   startDate: '2026-05-27', endDate: '2026-05-28', assignee: '원지예', status: '대기',   link: '' },
  { name: '마이페이지 > 나의 정기구독 > 정기구독 상세',                                                  startDate: '2026-05-29', endDate: '2026-06-01', assignee: '원지예', status: '대기',   link: '' },
  { name: '마이페이지 > 멤버십 혜택(+등급변경안내)',                                                      startDate: '2026-06-02', endDate: '2026-06-04', assignee: '원지예', status: '대기',   link: '' },
  { name: '마이페이지 > 온라인 적립금(+이전 적립금)',                                                     startDate: '2026-05-04', endDate: '2026-05-08', assignee: '최찬식', status: '대기',   link: '' },
  { name: '마이페이지 > 보유쿠폰',                                                                        startDate: '2026-05-11', endDate: '2026-05-12', assignee: '최찬식', status: '대기',   link: '' },
  { name: '마이페이지 > 주문/배송조회',                                                                   startDate: '2026-05-13', endDate: '2026-05-14', assignee: '최찬식', status: '대기',   link: '' },
  { name: '마이페이지 > 주문/배송조회 > 배송조회 상세 (+반품, 교환 신청)',                               startDate: '2026-05-15', endDate: '2026-05-15', assignee: '최찬식', status: '대기',   link: '' },
  { name: '마이페이지 > 취소/반품/교환조회(+상세)',                                                       startDate: '2026-05-26', endDate: '2026-05-26', assignee: '최찬식', status: '대기',   link: '' },
  { name: '마이페이지 > 나의 관심 상품',                                                                  startDate: '2026-05-27', endDate: '2026-05-27', assignee: '최찬식', status: '대기',   link: '' },
  { name: '마이페이지 > 1:1 문의내역',                                                                    startDate: '2026-05-28', endDate: '2026-05-28', assignee: '최찬식', status: '대기',   link: '' },
  { name: '마이페이지 > 배송지 관리',                                                                     startDate: '2026-05-29', endDate: '2026-05-29', assignee: '최찬식', status: '대기',   link: '' },
  { name: '마이페이지 > 회원정보수정',                                                                    startDate: '2026-06-05', endDate: '2026-06-05', assignee: '원지예', status: '대기',   link: '' },
  { name: '마이페이지 > 회원정보수정 > 회원정보탈퇴',                                                    startDate: '2026-06-08', endDate: '2026-06-08', assignee: '원지예', status: '대기',   link: '' },
  { name: '★정기구독 원클릭 온보딩 및 결제 완료 프로세스 구축★',                                        startDate: '2026-05-18', endDate: '2026-05-21', assignee: '원지예', status: '대기',   link: '' },
  { name: 'WEB 버전 MO(&Tablet) 대응',                                                                    startDate: '2026-06-19', endDate: '2026-06-19', assignee: '원지예', status: '대기',   link: '' },
  { name: 'VIP 라운지 - 리스트 / 상세',                                                                   startDate: '2026-06-09', endDate: '2026-06-10', assignee: '원지예', status: '대기',   link: '' },
  { name: '구독 플러스 - 리스트',                                                                         startDate: '2026-06-11', endDate: '2026-06-12', assignee: '원지예', status: '대기',   link: '' },
  { name: '로그인',                                                                                        startDate: '2026-06-01', endDate: '2026-06-01', assignee: '최찬식', status: '대기',   link: '' },
  { name: '회원가입',                                                                                      startDate: '2026-06-02', endDate: '2026-06-04', assignee: '최찬식', status: '대기',   link: '' },
  { name: '전체 메뉴 - 카테고리 / 이벤트 리스트',                                                        startDate: '2026-06-05', endDate: '2026-06-05', assignee: '최찬식', status: '대기',   link: '' },
  { name: '통합검색',                                                                                      startDate: '2026-06-08', endDate: '2026-06-08', assignee: '최찬식', status: '대기',   link: '' },
  { name: '제품구매가이드',                                                                                startDate: '2026-06-15', endDate: '2026-06-16', assignee: '원지예', status: '대기',   link: '' },
  { name: '신규혜택',                                                                                      startDate: '2026-06-17', endDate: '2026-06-18', assignee: '원지예', status: '대기',   link: '' },
  { name: '등급별 혜택',                                                                                   startDate: '2026-06-09', endDate: '2026-06-11', assignee: '최찬식', status: '대기',   link: '' },
  { name: '드시모네 앱 소개',                                                                              startDate: '2026-06-12', endDate: '2026-06-15', assignee: '최찬식', status: '대기',   link: '' },
  { name: '매거진 + 미디어 (각각 리스트와 상세 틀)',                                                      startDate: '2026-06-16', endDate: '2026-06-16', assignee: '최찬식', status: '대기',   link: '' },
  { name: '구매후기',                                                                                      startDate: '2026-06-17', endDate: '2026-06-17', assignee: '최찬식', status: '대기',   link: '' },
  { name: '이벤트 리스트(+상세 틀)',                                                                       startDate: '2026-06-18', endDate: '2026-06-18', assignee: '최찬식', status: '대기',   link: '' },
  { name: '공지사항',                                                                                      startDate: '2026-06-19', endDate: '2026-06-19', assignee: '최찬식', status: '대기',   link: '' },
  { name: '자주묻는 질문',                                                                                 startDate: '2026-06-22', endDate: '2026-06-22', assignee: '최찬식', status: '대기',   link: '' },
  { name: '개인정보 처리방침',                                                                             startDate: '2026-06-23', endDate: '2026-06-23', assignee: '최찬식', status: '대기',   link: '' },
  { name: '이용약관 + 정기구독 이용약관',                                                                 startDate: '',           endDate: '',           assignee: '',       status: '대기',   link: '' },
  { name: '산출물 점검 - 퍼블리싱 가이드',                                                                startDate: '',           endDate: '',           assignee: '퍼블팀', status: '대기',   link: '' },
]);

function formatDate(date: string): string {
  if (!date) return '-'
  const [, month, day] = date.split('-')
  return `${Number(month)}/${Number(day)}`
}

function calcDays(start: string, end: string): string {
  if (!start || !end) return '-'
  const s = new Date(start)
  const e = new Date(end)
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '-'
  return `${diff + 1}일`
}
</script>

<style lang="scss" scoped src="./pageList.scss"></style>
