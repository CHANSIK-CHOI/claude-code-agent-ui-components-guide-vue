#!/bin/bash
node -e '
let d="";
process.stdin.on("data",c=>d+=c).on("end",()=>{
  try{
    const j=JSON.parse(d);
    const model=(j.model&&j.model.display_name)||"Claude";
    const cost=(j.cost&&j.cost.total_cost_usd)||0;
    const parts=[model];

    // 여러 경로 동시 시도
    const ctx=
      (j.context_window&&j.context_window.used_percentage) ||
      (j.context_window&&j.context_window.usage_percentage) ||
      (j.usage&&j.usage.context_window_used_percentage);
    if(ctx!=null) parts.push("ctx: "+ctx.toFixed(1)+"%");

    parts.push("cost: $"+cost.toFixed(4));
    process.stdout.write(parts.join(" | "));
  }catch(e){process.stdout.write("Claude");}
});
'