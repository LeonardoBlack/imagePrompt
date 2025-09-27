// 简化的Coze工作流API测试
const COZE_TOKEN = "cztei_qOazV6mchuUguv4HCYopPce7A8RItrPlVdI9hQvNHFUM4JZjcz3N6BiMoENPBR1J4";
const WORKFLOW_ID = "7552453818337689652";
const IMAGE_URL = "https://p3-bot-workflow-sign.byteimg.com/tos-cn-i-mdko3gqilj/1ee21c36a6594189b14d9a97a966cd71.png~tplv-mdko3gqilj-image.image?rk3s=81d4c505&x-expires=1789567383&x-signature=rF85ZnwKEBRulXSmjv%2BAssaBvGo%3D&x-wf-file_name=yunling_tcm_avatar_studious_20250912024557_1+%282%29.png";

console.log("🚀 开始测试Coze工作流API...");
console.log("工作流ID:", WORKFLOW_ID);
console.log("图片URL:", IMAGE_URL);

fetch("https://api.coze.cn/v1/workflow/stream_run", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${COZE_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    workflow_id: WORKFLOW_ID,
    parameters: {
      img: IMAGE_URL,
      promptType: "flux",
      userQuery: "描述一下这张图片"
    }
  }),
})
.then(async (response) => {
  console.log("📡 响应状态:", response.status);
  console.log("📡 响应头:", Object.fromEntries(response.headers.entries()));
  
  const text = await response.text();
  console.log("📄 原始响应:", text);
  
  if (!response.ok) {
    console.error("❌ API错误:", text);
    return;
  }
  
  try {
    const data = JSON.parse(text);
    console.log("✅ 解析结果:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("📝 非JSON响应，按行解析:");
    const lines = text.split('\n').filter(line => line.trim());
    lines.forEach((line, index) => {
      console.log(`第${index + 1}行:`, line);
    });
  }
})
.catch((error) => {
  console.error("💥 网络错误:", error);
});