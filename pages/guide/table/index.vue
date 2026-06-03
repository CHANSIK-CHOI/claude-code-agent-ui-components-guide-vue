<template>
  <div class="tableGuidePage">
    <!-- 헤더 -->
    <header class="tableGuidePage__header">
      <div class="tableGuidePage__meta">
        <span class="tableGuidePage__badge">globals</span>
      </div>
      <h1 class="tableGuidePage__title">Table</h1>
      <p class="tableGuidePage__desc">
        순수 HTML <code>&lt;table&gt;</code> 태그에 적용되는 전역 스타일.<br />
        <code>assets/scss/components/table.scss</code>가 <code>nuxt.config.ts css:</code> 배열로 전역
        로드되어 별도 클래스 없이 <code>table</code>, <code>thead</code>, <code>tbody</code>, <code>tfoot</code>,
        <code>caption</code> 태그에 자동 적용됩니다.
      </p>
    </header>

    <!-- ① 기본 테이블 -->
    <section class="tableGuidePage__section">
      <h2 class="tableGuidePage__sectionTitle">① 기본 테이블</h2>
      <p class="tableGuidePage__note">
        <code>thead</code> / <code>tbody</code> 기본 구조. 별도 클래스 없이 자동 스타일 적용됩니다.
      </p>

      <div class="tableGuidePage__preview">
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>재직조건</th>
              <th>소득조건</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="2" class="center">상품 주문 및 배송 처리</td>
              <td>주문자정보(성명, 휴대전화번호)</td>
              <td rowspan="4">
                회원 탈퇴 시 파기 배송 및 주문자 정보는 5년간 보관 (전자상거래 등에서의 소비자보호에 관한 법률)
              </td>
            </tr>
            <tr>
              <td>배송지정보 (이름, 휴대전화번호, 주소)</td>
            </tr>
            <tr>
              <td class="center">상품 결제, 적립금 적립 및 사용, 부정거래확인</td>
              <td>
                -신용카드 결제 : 카드사명, 카드번호 등 정산을 위한 정보-010내통장결제 : 휴대폰번호, 계좌정보 (은행명,
                계좌번호)-010가상계좌 : 휴대폰번호-휴대폰결제 : 휴대폰번호, 통신사, 생년월일-간편결제서비스(PAYCO/
                카카오페이/ 네이버페이) : 이름, 휴대전화번호, 이메일주소
              </td>
            </tr>
            <tr>
              <td class="center">현금영수증 발행</td>
              <td>휴대폰번호, 신용카드번호, 현금영수증 카드번호, 사업자번호</td>
            </tr>
            <tr>
              <td class="center">환불</td>
              <td>(선택) 예금주, 은행명, 계좌번호</td>
              <td>
                회원 탈퇴 시 파기단, 계약 또는 청약철회, 대금결제, 재화 등의 공급기록은 5년간 보관 (전자상거래 등에서의
                소비자보호에 관한 법률)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre class="tableGuidePage__code"><code>&lt;table&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th&gt;항목&lt;/th&gt;
      &lt;th&gt;설명&lt;/th&gt;
      &lt;th&gt;비고&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;
      &lt;td&gt;주문 번호&lt;/td&gt;
      &lt;td&gt;주문 생성 시 자동 발급되는 고유 번호&lt;/td&gt;
      &lt;td&gt;숫자 12자리&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</code></pre>
    </section>

    <!-- ② colspan / rowspan -->
    <section class="tableGuidePage__section">
      <h2 class="tableGuidePage__sectionTitle">② colspan / rowspan — 셀 병합</h2>
      <p class="tableGuidePage__note">
        <code>colspan</code>으로 열 병합, <code>rowspan</code>으로 행 병합. 셀 경계 border가 자연스럽게 처리됩니다.
      </p>

      <div class="tableGuidePage__preview">
        <table>
          <thead>
            <tr>
              <th rowspan="2">구분</th>
              <th colspan="2">1분기</th>
              <th colspan="2">2분기</th>
            </tr>
            <tr>
              <th>1월</th>
              <th>2월</th>
              <th>4월</th>
              <th>5월</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>매출</td>
              <td>1,200만원</td>
              <td>980만원</td>
              <td>1,450만원</td>
              <td>1,310만원</td>
            </tr>
            <tr>
              <td>반품</td>
              <td>32만원</td>
              <td>18만원</td>
              <td>45만원</td>
              <td>27만원</td>
            </tr>
            <tr>
              <td>순매출</td>
              <td>1,168만원</td>
              <td>962만원</td>
              <td>1,405만원</td>
              <td>1,283만원</td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre class="tableGuidePage__code"><code>&lt;thead&gt;
  &lt;tr&gt;
    &lt;th rowspan="2"&gt;구분&lt;/th&gt;
    &lt;th colspan="2"&gt;1분기&lt;/th&gt;
    &lt;th colspan="2"&gt;2분기&lt;/th&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;th&gt;1월&lt;/th&gt;&lt;th&gt;2월&lt;/th&gt;
    &lt;th&gt;4월&lt;/th&gt;&lt;th&gt;5월&lt;/th&gt;
  &lt;/tr&gt;
&lt;/thead&gt;</code></pre>
    </section>

    <!-- ③ tfoot 사용 -->
    <section class="tableGuidePage__section">
      <h2 class="tableGuidePage__sectionTitle">③ tfoot — 합계 행</h2>
      <p class="tableGuidePage__note">
        <code>tfoot</code>은 합계·소계 등 표 하단 요약 행에 사용합니다. <code>thead</code>와 동일한 회색 배경이
        적용됩니다.
      </p>

      <div class="tableGuidePage__preview">
        <table>
          <thead>
            <tr>
              <th>상품명</th>
              <th>수량</th>
              <th>단가</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>수분크림 50ml</td>
              <td class="text-center">2</td>
              <td class="text-right">32,000원</td>
              <td class="text-right">64,000원</td>
            </tr>
            <tr>
              <td>오투부스터 미스트 100ml</td>
              <td class="text-center">1</td>
              <td class="text-right">18,000원</td>
              <td class="text-right">18,000원</td>
            </tr>
            <tr>
              <td>비타민C 앰플 30ml</td>
              <td class="text-center">3</td>
              <td class="text-right">45,000원</td>
              <td class="text-right">135,000원</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">합계</td>
              <td class="text-right">217,000원</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <pre class="tableGuidePage__code"><code>&lt;tfoot&gt;
  &lt;tr&gt;
    &lt;td colspan="3"&gt;합계&lt;/td&gt;
    &lt;td class="text-right"&gt;217,000원&lt;/td&gt;
  &lt;/tr&gt;
&lt;/tfoot&gt;</code></pre>
    </section>

    <!-- ④ caption 사용 -->
    <section class="tableGuidePage__section">
      <h2 class="tableGuidePage__sectionTitle">④ caption — 표 제목</h2>
      <p class="tableGuidePage__note">
        <code>caption</code>은 표 하단에 표시되는 설명 텍스트입니다. 보조기기에서 표의 목적을 전달하는 시맨틱 역할도
        합니다.
      </p>

      <div class="tableGuidePage__preview">
        <table>
          <caption>
            * 배송비는 3만원 이상 구매 시 무료
          </caption>
          <thead>
            <tr>
              <th>배송 방법</th>
              <th>배송 기간</th>
              <th>배송비</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>일반 택배</td>
              <td>2~3 영업일</td>
              <td>3,000원</td>
            </tr>
            <tr>
              <td>빠른 배송</td>
              <td>당일 or 익일</td>
              <td>5,000원</td>
            </tr>
            <tr>
              <td>무료 배송</td>
              <td>2~3 영업일</td>
              <td>무료 (3만원 이상)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre class="tableGuidePage__code"><code>&lt;table&gt;
  &lt;caption&gt;* 배송비는 3만원 이상 구매 시 무료&lt;/caption&gt;
  ...
&lt;/table&gt;</code></pre>
    </section>

    <!-- ⑤ 텍스트 정렬 유틸리티 -->
    <section class="tableGuidePage__section">
      <h2 class="tableGuidePage__sectionTitle">⑤ 텍스트 정렬 유틸리티</h2>
      <p class="tableGuidePage__note">
        <code>th</code> / <code>td</code> 에 직접 클래스를 추가해 정렬을 변경합니다.<br />
        기본값: <code>th</code> → center, <code>td</code> → left
      </p>

      <div class="tableGuidePage__preview">
        <table>
          <thead>
            <tr>
              <th>기본 (center)</th>
              <th class="text-left">text-left</th>
              <th class="text-right">text-right</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">text-center</td>
              <td>기본 (left)</td>
              <td class="text-right">text-right</td>
            </tr>
            <tr>
              <td class="text-center">숫자 합계</td>
              <td>설명 텍스트는 좌측 정렬이 읽기 쉽습니다</td>
              <td class="text-right">128,000원</td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre class="tableGuidePage__code"><code>&lt;th class="text-left"&gt;왼쪽 정렬 헤더&lt;/th&gt;
&lt;td class="text-center"&gt;가운데 정렬&lt;/td&gt;
&lt;td class="text-right"&gt;오른쪽 정렬&lt;/td&gt;</code></pre>
    </section>

    <!-- ⑥ 실전 예시 — 피그마 디자인 기반 -->
    <section class="tableGuidePage__section">
      <h2 class="tableGuidePage__sectionTitle">⑥ 실전 예시 — 개인정보 처리 테이블</h2>
      <p class="tableGuidePage__note">
        피그마 디자인 원본과 동일한 구조. <code>rowspan</code>으로 좌측 구분 열을 병합합니다.
      </p>

      <div class="tableGuidePage__preview">
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>재직조건</th>
              <th>소득조건</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="2" class="text-center">상품 주문 및<br />배송 처리</td>
              <td>주문자정보(성명, 휴대전화번호)</td>
              <td rowspan="2"></td>
            </tr>
            <tr>
              <td>배송지정보<br />(이름, 휴대전화번호, 주소)</td>
            </tr>
            <tr>
              <td class="text-center">상품 결제,<br />적립금 적립 및 사용,<br />부정거래확인</td>
              <td>
                -신용카드 결제 : 카드사명, 카드번호 등 정산을 위한 정보<br />
                -010내통장결제 : 휴대폰번호, 계좌정보 (은행명, 계좌번호)<br />
                -010가상계좌 : 휴대폰번호<br />
                -휴대폰결제 : 휴대폰번호, 통신사, 생년월일<br />
                -간편결제서비스(PAYCO/카카오페이/네이버페이) : 이름, 휴대전화번호, 이메일주소
              </td>
              <td>
                회원 탈퇴 시 파기<br />
                배송 및 주문자 정보는 5년간 보관<br />
                (전자상거래 등에서의 소비자보호에 관한 법률)
              </td>
            </tr>
            <tr>
              <td class="text-center">현금영수증<br />발행</td>
              <td>휴대폰번호, 신용카드번호, 현금영수증 카드번호, 사업자번호</td>
              <td></td>
            </tr>
            <tr>
              <td class="text-center">환불</td>
              <td>(선택) 예금주, 은행명, 계좌번호</td>
              <td>
                회원 탈퇴 시 파기<br />
                단, 계약 또는 청약철회, 대금결제, 재화 등의 공급기록은 5년간 보관<br />
                (전자상거래 등에서의 소비자보호에 관한 법률)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ⑦ 적용 원리 -->
    <section class="tableGuidePage__section">
      <h2 class="tableGuidePage__sectionTitle">⑦ 적용 원리</h2>

      <h3 class="tableGuidePage__tableTitle">스타일 속성</h3>
      <table>
        <thead>
          <tr>
            <th>선택자</th>
            <th>주요 속성</th>
            <th>값 (토큰)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>table</code></td>
            <td>border, border-radius, overflow</td>
            <td><code>$line-300</code>, <code>$radius-sm</code>, hidden</td>
          </tr>
          <tr>
            <td><code>thead th</code></td>
            <td>background-color, color, font-size</td>
            <td><code>$bg-tertiary</code>, <code>$text-800</code>, <code>$font-size-caption2</code> (12px)</td>
          </tr>
          <tr>
            <td><code>tbody td</code></td>
            <td>color, font-size, line-height</td>
            <td><code>$text-600</code>, <code>$font-size-caption3</code> (11px), 1.8rem</td>
          </tr>
          <tr>
            <td><code>tfoot td, tfoot th</code></td>
            <td>background-color, border-top</td>
            <td><code>$bg-tertiary</code>, <code>$line-300</code></td>
          </tr>
          <tr>
            <td><code>caption</code></td>
            <td>caption-side, color</td>
            <td>bottom, <code>$text-400</code></td>
          </tr>
        </tbody>
      </table>

      <h3 class="tableGuidePage__tableTitle">유틸리티 클래스</h3>
      <table>
        <thead>
          <tr>
            <th>클래스</th>
            <th>효과</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>.text-left</code></td>
            <td>셀 텍스트 왼쪽 정렬</td>
          </tr>
          <tr>
            <td><code>.text-center</code></td>
            <td>셀 텍스트 가운데 정렬</td>
          </tr>
          <tr>
            <td><code>.text-right</code></td>
            <td>셀 텍스트 오른쪽 정렬</td>
          </tr>
        </tbody>
      </table>

      <p class="tableGuidePage__infoNote">
        <strong>전역 적용 방식</strong>: <code>table.scss</code>는 <code>nuxt.config.ts</code>의
        <code>css: []</code> 배열에 등록되어 별도 import 없이 모든 페이지에서 자동 적용됩니다.<br />
        <code>vite.css.preprocessorOptions.additionalData</code>로 SCSS 변수가 자동 주입되므로 파일 내에서
        <code>@use</code> 없이 토큰 변수를 사용합니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'guide' })
</script>

<style lang="scss" scoped src="./table.scss"></style>
