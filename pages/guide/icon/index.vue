<template>
  <div class="iconGuidePage">
    <!-- 헤더 -->
    <header class="iconGuidePage__header">
      <div class="iconGuidePage__meta">
        <span class="iconGuidePage__badge">icons</span>
      </div>
      <h1 class="iconGuidePage__title">Icon</h1>
      <p class="iconGuidePage__desc">
        SVG 기반 아이콘 시스템. <code>Icon.vue</code> Base 컴포넌트와 SVG 직접 import 방식을 사용합니다.<br />
        <code>size</code> / <code>color</code> / <code>label</code> prop으로 크기·색상·접근성을 제어합니다.
      </p>
    </header>

    <!-- ① 사이즈별 아이콘 목록 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">① 사이즈별 아이콘</h2>
      <p class="iconGuidePage__note">
        현재 등록된 아이콘 목록입니다. SVG 파일을 <code>assets/icons/</code>에 추가한 뒤 사용처에서 직접 import하세요.
      </p>

      <!-- lg 그룹 (40px) -->
      <div class="iconGuidePage__group">
        <p class="iconGuidePage__groupTitle">size="lg" — 40px</p>

        <p class="iconGuidePage__subGroupTitle">색상 고정 (skipsvgo)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="lg"><ShoppingCartSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">shoppingCart.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="lg"&gt;&lt;ShoppingCartSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="lg"><ShoppingCartCheckSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">shoppingCartCheck.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="lg"&gt;&lt;ShoppingCartCheckSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="lg"><ShoppingCartPlusSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">shoppingCartPlus.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="lg"&gt;&lt;ShoppingCartPlusSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="lg"><DocumentSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">document.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="lg"&gt;&lt;DocumentSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="lg"><BigCircularNoteIconSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">bigCircularNoteIcon.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="lg"&gt;&lt;BigCircularNoteIconSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="lg"><PhoneSearchSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">phoneSearch.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="lg"&gt;&lt;PhoneSearchSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- md 그룹 (24px) -->
      <div class="iconGuidePage__group">
        <p class="iconGuidePage__groupTitle">size="md" — 24px</p>

        <p class="iconGuidePage__subGroupTitle">일반 (currentColor)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><CloseSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">close.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;CloseSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><SearchSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">search.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;SearchSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><UserSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">user.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;UserSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><ChevronLeftSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">chevronLeft.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;ChevronLeftSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><ChevronRightSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">chevronRight.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;ChevronRightSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><CategorySvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">category.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;CategorySvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><HomeSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">home.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;HomeSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><LogoutSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">logout.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;LogoutSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><MoreVerticalSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">moreVertical.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;MoreVerticalSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><CalenderSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">calender.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;CalenderSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><PlusSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">plus.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;PlusSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><DeleteSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">delete.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;DeleteSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><TimeSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">time.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;TimeSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><BagSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">bag.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;BagSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>

          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><ShareSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">share.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;ShareSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><HeartLineSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">heartLine.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;HeartLineSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>

          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><BigCircularNoteIconFilledSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">bigCircularNoteIconFilled.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon&gt;&lt;BigCircularNoteIconFilledSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
        </div>

        <p class="iconGuidePage__subGroupTitle">색상 고정 (skipsvgo)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><LeftSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">left.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;LeftSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><RightSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">right.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;RightSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><PlaySvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">play.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;PlaySvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><GridSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">grid.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;GridSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><ListSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">list.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;ListSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><HeartFullSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">heartFull.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;HeartFullSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><HeartSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">heart.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;HeartSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><CardSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">card.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;CardSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><TruckSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">truck.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;TruckSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><BoxSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">box.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;BoxSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon><SkipSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">skip.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon&gt;&lt;SkipSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- sm 그룹 (16px) -->
      <div class="iconGuidePage__group">
        <p class="iconGuidePage__groupTitle">size="sm" — 16px</p>

        <p class="iconGuidePage__subGroupTitle">일반 (currentColor)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><SmallChevronDownSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">smallChevronDown.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;SmallChevronDownSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><SmallChevronUpSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">smallChevronUp.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;SmallChevronUpSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><SmallChevronLeftSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">smallChevronLeft.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;SmallChevronLeftSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><SmallChevronRightSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">smallChevronRight.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;SmallChevronRightSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><SmallPlusSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">smallPlus.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;SmallPlusSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><SmallCloseSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">smallClose.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;SmallCloseSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><SmallBagSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">smallBag.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;SmallBagSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><SmallGreatSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">smallGreat.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;SmallGreatSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><GiftSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">gift.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon size="sm"&gt;&lt;GiftSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><KakaoSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">kakao.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;KakaoSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><ChainSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">chain.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;ChainSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><NotificationSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">notification.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;NotificationSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><AlertSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">alert.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon size="sm"&gt;&lt;AlertSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><CouponSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">coupon.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon size="sm"&gt;&lt;CouponSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><PencilFilledSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">pencilFilled.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;PencilFilledSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><DownloadSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">download.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;DownloadSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
        </div>

        <p class="iconGuidePage__subGroupTitle">색상 고정 (skipsvgo)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><LockSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">lock.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon size="sm"&gt;&lt;LockSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><TooltipSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">tooltip.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;TooltipSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><CircularNoteSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">circularNote.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;CircularNoteSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><CircularArrowSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">circularArrow.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;CircularArrowSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><IcCheckCircleSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">IcCheckCircle.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;IcCheckCircleSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><IcCircularNoteSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">IcCircularNote.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;IcCircularNoteSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="sm"><ChattingSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">chatting.svg</span>
            <pre
              class="iconGuidePage__iconCode"
            ><code>&lt;Icon size="sm"&gt;&lt;ChattingSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- xs 그룹 (8px) -->
      <div class="iconGuidePage__group">
        <p class="iconGuidePage__groupTitle">size="xs" — 8px</p>

        <p class="iconGuidePage__subGroupTitle">색상 고정 (skipsvgo)</p>
        <div class="iconGuidePage__iconGrid">
          <div class="iconGuidePage__iconItem">
            <div class="iconGuidePage__iconPreview">
              <Icon size="xs"><StarSvg /></Icon>
            </div>
            <span class="iconGuidePage__iconName">star.svg</span>
            <pre class="iconGuidePage__iconCode"><code>&lt;Icon size="xs"&gt;&lt;StarSvg /&gt;&lt;/Icon&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 커스텀 사이즈 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">② 커스텀 사이즈</h2>
      <p class="iconGuidePage__note">
        <code>size</code> prop에 <code>number</code>를 전달하면 프리셋 CSS class 대신 inline style(<code>width</code> /
        <code>height</code>)로 크기를 적용합니다. 정방형 기준입니다.
      </p>

      <div class="iconGuidePage__row iconGuidePage__row--horizontal">
        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">:size="32"</span>
          <div class="iconGuidePage__iconPreview">
            <Icon :size="32"><HomeSvg /></Icon>
          </div>
          <pre class="iconGuidePage__code"><code>&lt;Icon :size="32"&gt;&lt;HomeSvg /&gt;&lt;/Icon&gt;</code></pre>
        </div>

        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">:size="50"</span>
          <div class="iconGuidePage__iconPreview">
            <Icon :size="50"><HomeSvg /></Icon>
          </div>
          <pre class="iconGuidePage__code"><code>&lt;Icon :size="50"&gt;&lt;HomeSvg /&gt;&lt;/Icon&gt;</code></pre>
        </div>

        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">:size="72" + color</span>
          <div class="iconGuidePage__iconPreview">
            <Icon :size="72" color="#0CB5E2"><HomeSvg /></Icon>
          </div>
          <pre
            class="iconGuidePage__code"
          ><code>&lt;Icon :size="72" color="#0CB5E2"&gt;&lt;HomeSvg /&gt;&lt;/Icon&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ③ 색상 제어 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">③ 색상 제어</h2>
      <p class="iconGuidePage__note">
        <code>color</code> prop 미전달 시 부모의 CSS <code>color</code> 값을 <code>currentColor</code>로 상속합니다.
      </p>

      <div class="iconGuidePage__row">
        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">color prop 직접 지정</span>
          <div class="iconGuidePage__iconPreview">
            <Icon color="#0CB5E2"><HomeSvg /></Icon>
          </div>
          <pre class="iconGuidePage__code"><code>&lt;Icon color="#0CB5E2"&gt;&lt;HomeSvg /&gt;&lt;/Icon&gt;</code></pre>
        </div>

        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">부모 color 상속 (currentColor)</span>
          <div class="iconGuidePage__iconPreview iconGuidePage__iconPreview--colored">
            <Icon><HomeSvg /></Icon>
          </div>
          <pre class="iconGuidePage__code"><code>&lt;span style="color: #0CB5E2;"&gt;
  &lt;Icon&gt;&lt;HomeSvg /&gt;&lt;/Icon&gt;
&lt;/span&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ④ 접근성 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">④ 접근성</h2>

      <div class="iconGuidePage__row">
        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">장식 아이콘 (기본) — aria-hidden="true"</span>
          <div class="iconGuidePage__iconPreview">
            <Icon><HomeSvg /></Icon>
          </div>
          <pre class="iconGuidePage__code"><code>&lt;!-- aria-hidden="true" 자동 적용 --&gt;
&lt;Icon&gt;&lt;HomeSvg /&gt;&lt;/Icon&gt;</code></pre>
        </div>

        <div class="iconGuidePage__item">
          <span class="iconGuidePage__itemLabel">의미 있는 아이콘 — label prop 전달</span>
          <div class="iconGuidePage__iconPreview">
            <Icon label="홈으로 이동"><HomeSvg /></Icon>
          </div>
          <pre class="iconGuidePage__code"><code>&lt;!-- aria-label="홈으로 이동" + role="img" 자동 적용 --&gt;
&lt;Icon label="홈으로 이동"&gt;&lt;HomeSvg /&gt;&lt;/Icon&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- ⑥ 아이콘 추가 방법 -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">⑤ 아이콘 추가 방법</h2>
      <p class="iconGuidePage__note">
        Figma에서 SVG 내보내기 후 <code>assets/icons/</code>에 파일을 추가하고, 사용처에서 직접 import하세요.
      </p>
      <pre class="iconGuidePage__code"><code>// 1. assets/icons/ 에 SVG 파일 추가 (예: newIcon.svg)

// 2. 사용 파일에서 직접 import
import Icon from '@nd/components/icons/Icon.vue'
import NewIconSvg from '@nd/assets/icons/newIcon.svg?component'
//   색상 고정(fill/stroke 유지)이 필요한 경우: ?skipsvgo

// 3. template에서 Icon 래퍼로 사용
// &lt;Icon size="md"&gt;&lt;NewIconSvg /&gt;&lt;/Icon&gt;</code></pre>
    </section>

    <!-- ⑦ Props -->
    <section class="iconGuidePage__section">
      <h2 class="iconGuidePage__sectionTitle">⑥ Props</h2>

      <h3 class="iconGuidePage__tableTitle">Icon.vue (Base)</h3>
      <div class="iconGuidePage__propsTableWrap">
        <table class="iconGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>타입</th>
              <th>기본값</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>size</code></td>
              <td><code>'xs' | 'sm' | 'md' | 'lg' | number</code></td>
              <td><code>'md'</code></td>
              <td>아이콘 크기. 프리셋 문자열은 CSS class(8 / 16 / 24 / 40px), 숫자는 inline style(정방형 px)로 처리</td>
            </tr>
            <tr>
              <td><code>color</code></td>
              <td><code>string | undefined</code></td>
              <td><code>undefined</code></td>
              <td>CSS color 값. 미전달 시 부모 color 상속</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string | undefined</code></td>
              <td><code>undefined</code></td>
              <td>접근성 라벨. 전달 시 aria-label + role="img" 적용</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="iconGuidePage__tableTitle">Slots (Icon.vue)</h3>
      <div class="iconGuidePage__propsTableWrap">
        <table class="iconGuidePage__propsTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>필수</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>default</code></td>
              <td>필수</td>
              <td>SVG 엘리먼트를 삽입하는 슬롯</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="iconGuidePage__delegationNote">
        <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로 위 Props 외에도
        <code>&lt;span&gt;</code> 요소의 모든 네이티브 HTML 속성 (<code>aria-label</code>, <code>tabindex</code>,
        <code>data-*</code> 등)을 그대로 전달할 수 있습니다.<br />
        React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@nd/components/icons/Icon.vue';

  // --- lg / skipsvgo ---
  import ShoppingCartSvg from '@nd/assets/icons/shoppingCart.svg?skipsvgo';
  import ShoppingCartCheckSvg from '@nd/assets/icons/shoppingCartCheck.svg?skipsvgo';
  // @ts-ignore
  import ShoppingCartPlusSvg from '@nd/assets/icons/shoppingCartPlus.svg?skipsvgo';
  import DocumentSvg from '@nd/assets/icons/document.svg?skipsvgo';
  import BigCircularNoteIconSvg from '@nd/assets/icons/bigCircularNoteIcon.svg?skipsvgo';
  // @ts-ignore
  import PhoneSearchSvg from '@nd/assets/icons/phoneSearch.svg?skipsvgo';

  // --- md / currentColor ---
  import CloseSvg from '@nd/assets/icons/close.svg?component';
  import SearchSvg from '@nd/assets/icons/search.svg?component';
  import UserSvg from '@nd/assets/icons/user.svg?component';
  import ChevronLeftSvg from '@nd/assets/icons/chevronLeft.svg?component';
  import ChevronRightSvg from '@nd/assets/icons/chevronRight.svg?component';
  import CategorySvg from '@nd/assets/icons/category.svg?component';
  import HomeSvg from '@nd/assets/icons/home.svg?component';
  import LogoutSvg from '@nd/assets/icons/logout.svg?component';
  // @ts-ignore
  import MoreVerticalSvg from '@nd/assets/icons/moreVertical.svg?component';
  import CalenderSvg from '@nd/assets/icons/calender.svg?component';
  import PlusSvg from '@nd/assets/icons/plus.svg?component';
  import DeleteSvg from '@nd/assets/icons/delete.svg?component';
  import TimeSvg from '@nd/assets/icons/time.svg?component';
  import BagSvg from '@nd/assets/icons/bag.svg?component';
  import ShareSvg from '@nd/assets/icons/share.svg?component';
  import HeartLineSvg from '@nd/assets/icons/heartLine.svg?component';
  import BigCircularNoteIconFilledSvg from '@nd/assets/icons/bigCircularNoteIconFilled.svg?component';

  // --- md / skipsvgo ---
  import LeftSvg from '@nd/assets/icons/left.svg?skipsvgo';
  import RightSvg from '@nd/assets/icons/right.svg?skipsvgo';
  import PlaySvg from '@nd/assets/icons/play.svg?skipsvgo';
  import GridSvg from '@nd/assets/icons/grid.svg?skipsvgo';
  import ListSvg from '@nd/assets/icons/list.svg?skipsvgo';
  import HeartFullSvg from '@nd/assets/icons/heartFull.svg?skipsvgo';
  import HeartSvg from '@nd/assets/icons/heart.svg?skipsvgo';
  import CardSvg from '@nd/assets/icons/card.svg?skipsvgo';
  import TruckSvg from '@nd/assets/icons/truck.svg?skipsvgo';
  // @ts-ignore
  import BoxSvg from '@nd/assets/icons/box.svg?skipsvgo';
  // @ts-ignore
  import SkipSvg from '@nd/assets/icons/skip.svg?skipsvgo';
  import LockSvg from '@nd/assets/icons/lock.svg?skipsvgo';

  // --- sm / currentColor ---
  import SmallChevronDownSvg from '@nd/assets/icons/smallChevronDown.svg?component';
  import SmallChevronUpSvg from '@nd/assets/icons/smallChevronUp.svg?component';
  import SmallChevronLeftSvg from '@nd/assets/icons/smallChevronLeft.svg?component';
  import SmallChevronRightSvg from '@nd/assets/icons/smallChevronRight.svg?component';
  import SmallPlusSvg from '@nd/assets/icons/smallPlus.svg?component';
  import SmallCloseSvg from '@nd/assets/icons/smallClose.svg?component';
  import SmallBagSvg from '@nd/assets/icons/smallBag.svg?component';
  import SmallGreatSvg from '@nd/assets/icons/smallGreat.svg?component';
  import GiftSvg from '@nd/assets/icons/gift.svg?component';
  import KakaoSvg from '@nd/assets/icons/kakao.svg?component';
  import ChainSvg from '@nd/assets/icons/chain.svg?component';
  import NotificationSvg from '@nd/assets/icons/notification.svg?component';
  import AlertSvg from '@nd/assets/icons/alert.svg?component';
  import CouponSvg from '@nd/assets/icons/coupon.svg?component';
  import PencilFilledSvg from '@nd/assets/icons/pencilFilled.svg?component';
  import DownloadSvg from '@nd/assets/icons/download.svg?component';

  // --- sm / skipsvgo ---
  import TooltipSvg from '@nd/assets/icons/tooltip.svg?skipsvgo';
  import CircularNoteSvg from '@nd/assets/icons/circularNote.svg?skipsvgo';
  import CircularArrowSvg from '@nd/assets/icons/circularArrow.svg?skipsvgo';
  import IcCheckCircleSvg from '@nd/assets/icons/IcCheckCircle.svg?skipsvgo';
  import IcCircularNoteSvg from '@nd/assets/icons/IcCircularNote.svg?skipsvgo';
  // @ts-ignore
  import ChattingSvg from '@nd/assets/icons/chatting.svg?skipsvgo';

  // --- xs / skipsvgo ---
  import StarSvg from '@nd/assets/icons/star.svg?skipsvgo';

  definePageMeta({ layout: 'guide' });
</script>

<style lang="scss" scoped src="./icon.scss"></style>
