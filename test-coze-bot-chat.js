// 测试Coze Bot Chat API
const COZE_TOKEN = "cztei_qOazV6mchuUguv4HCYopPce7A8RItrPlVdI9hQvNHFUM4JZjcz3N6BiMoENPBR1J4";
const BOT_ID = "7429451976378656804"; // 需要获取正确的Bot ID
const USER_ID = "user_123456"; // 任意用户ID
const IMAGE_URL = "https://p3-bot-workflow-sign.byteimg.com/tos-cn-i-mdko3gqilj/1ee21c36a6594189b14d9a97a966cd71.png~tplv-mdko3gqilj-image.image?rk3s=81d4c505&x-expires=1789567383&x-signature=rF85ZnwKEBRulXSmjv%2BAssaBvGo%3D&x-wf-file_name=yunling_tcm_avatar_studious_20250912024557_1+%282%29.png";

console.log("🚀 开始测试Coze Bot Chat API...");
console.log("Bot ID:", BOT_ID);
console.log("用户ID:", USER_ID);

// 第一步：创建对话
fetch("https://api.coze.cn/v1/conversation/create", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${COZE_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    bot_id: BOT_ID,
    user_id: USER_ID,
    additional_messages: [
      {
        role: "user",
        content: `请分析这张图片并生成详细的AI绘图提示词: ${IMAGE_URL}`
      }
    ]
  }),
})
.then(async (response) => {
  console.log("📡 创建对话响应状态:", response.status);
  
  const text = await response.text();
  console.log("📄 原始响应:", text);
  
  if (!response.ok) {
    console.error("❌ 创建对话失败:", text);
    return;
  }
  
  try {
    const data = JSON.parse(text);
    console.log("✅ 对话创建成功:", JSON.stringify(data, null, 2));
    
    if (data.conversation_id) {
      // 第二步：获取对话消息
      console.log("\n🔄 获取对话消息...");
      return fetch(`https://api.coze.cn/v1/conversation/${data.conversation_id}/messages`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${COZE_TOKEN}`,
        },
      });
    }
  } catch (e) {
    console.log("📝 响应解析失败:", e);
  }
})
.then(async (messagesResponse) => {
  if (messagesResponse) {
    console.log("📡 获取消息响应状态:", messagesResponse.status);
    const messagesText = await messagesResponse.text();
    console.log("📄 消息响应:", messagesText);
  }
})
.catch((error) => {
  console.error("💥 网络错误:", error);
});