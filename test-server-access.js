// 测试服务器访问的简单脚本
const testUrls = [
  'http://localhost:12883',
  'http://localhost:12883/en',
  'http://localhost:12883/en/dashboard',
  'http://localhost:12883/en/dashboard/coze',
  'http://localhost:12883/en/login',
  'http://localhost:12883/en/login-clerk'
];

async function testUrl(url) {
  try {
    const response = await fetch(url);
    console.log(`✅ ${url} - Status: ${response.status} ${response.statusText}`);
    return true;
  } catch (error) {
    console.log(`❌ ${url} - Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 测试服务器访问...\n');
  
  for (const url of testUrls) {
    await testUrl(url);
    // 等待一小段时间避免过快请求
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📋 测试完成！');
  console.log('\n💡 如果所有URL都返回404，可能是：');
  console.log('   - 需要登录认证');
  console.log('   - 路由配置问题');
  console.log('   - 语言参数问题');
  console.log('\n💡 建议：');
  console.log('   1. 尝试访问 http://localhost:12883/en/login-clerk');
  console.log('   2. 检查浏览器开发者工具的网络标签');
  console.log('   3. 查看服务器控制台日志');
}

runTests();