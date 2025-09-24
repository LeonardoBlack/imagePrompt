import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { UPLOAD_LIMITS } from "~/lib/ai-config";

// 图片上传处理
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "未找到图片文件" },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!UPLOAD_LIMITS.allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "不支持的图片格式" },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (file.size > UPLOAD_LIMITS.maxFileSize) {
      return NextResponse.json(
        { error: "图片文件过大" },
        { status: 400 }
      );
    }

    // 创建上传目录
    const uploadDir = join(process.cwd(), "public", "uploads", "ai-images");
    await mkdir(uploadDir, { recursive: true });

    // 生成唯一文件名
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 返回文件URL
    const fileUrl = `/uploads/ai-images/${fileName}`;

    return NextResponse.json({
      url: fileUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("图片上传失败:", error);
    return NextResponse.json(
      { error: "图片上传失败，请重试" },
      { status: 500 }
    );
  }
}