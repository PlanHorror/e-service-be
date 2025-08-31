import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Proposal } from '@prisma/client';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendProposalCreationConfirmation(proposal: Proposal): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL,
      to: proposal.email,
      subject: 'Xác Nhận Đề Nghị - VJU E-Service',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xác Nhận Đề Nghị</title>
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0;">
          <div style="max-width: 650px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">

            <!-- Header -->
            <header style="background-color: #9E0612; color: white; padding: 20px; text-align: center;">
              <img src="https://upload.wikimedia.org/wikipedia/vi/a/a0/Logo_vju.svg" alt="Logo VJU" style="height: 60px; margin-bottom: 10px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600;">CỔNG DỊCH VỤ CÔNG TRƯỜNG ĐẠI HỌC VIỆT NHẬT</h1>
              <p style="margin: 5px 0 0; font-size: 13px; opacity: 0.9;">Kết nối, cung cấp thông tin và dịch vụ công mọi lúc, mọi nơi</p>
            </header>
            
            <!-- Main Content -->
            <main style="padding: 25px;">
              <h2 style="color: #2c3e50; margin-top: 0; font-size: 18px;">📄 Đề nghị đã được tạo thành công</h2>
              
              <p style="font-size: 15px; color: #334155;">Kính gửi <strong>${proposal.full_name}</strong>,</p>
              <p style="font-size: 15px; color: #334155;">
                Đề nghị của bạn đã được hệ thống ghi nhận. Thông tin chi tiết như sau:
              </p>

              <!-- Proposal Info Box -->
              <div style="background-color: #f9fafb; padding: 18px; border-radius: 6px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 6px 0; color: #475569;"><strong>Mã đề nghị:</strong> ${proposal.code}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Mã bảo mật:</strong> ${proposal.security_code}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Họ và tên:</strong> ${proposal.full_name}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Email:</strong> ${proposal.email}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Số điện thoại:</strong> ${proposal.phone}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Địa chỉ:</strong> ${proposal.address}</p>
                ${proposal.note ? `<p style="margin: 6px 0; color: #475569;"><strong>Ghi chú:</strong> ${proposal.note}</p>` : ''}
                <p style="margin: 6px 0; color: #475569;"><strong>Trạng thái:</strong> ${proposal.status}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Ngày tạo:</strong> ${proposal.created_at.toLocaleDateString('vi-VN')}</p>
              </div>

              <!-- Alert Box -->
              <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffca2c; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #856404;">
                  <strong>Lưu ý:</strong> Vui lòng giữ an toàn mã đề nghị và mã bảo mật để tra cứu trạng thái.
                </p>
              </div>
              
              <p style="font-size: 15px; color: #334155;">Đề nghị của bạn đang được xem xét. Bạn sẽ nhận thông báo khi có cập nhật.</p>
              <p style="font-size: 15px; color: #334155;">Xin cảm ơn bạn đã sử dụng dịch vụ!</p>
            </main>

            <!-- Footer -->
            <footer style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Đây là email tự động, vui lòng không trả lời.<br>
                Mọi thắc mắc vui lòng liên hệ <a href="mailto:support@vju.edu.vn" style="color: #9E0612; text-decoration: none;">support@vju.edu.vn</a>.
              </p>
            </footer>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${proposal.email}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  }

  async sendManagerNotification(
    proposal: Proposal,
    managerEmail: string = process.env.MANAGER_EMAIL!,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL,
      to: managerEmail,
      subject: 'Thông Báo Đề Nghị Mới - VJU E-Service',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thông Báo Đề Nghị Mới</title>
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0;">
          <div style="max-width: 650px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">

            <!-- Header -->
            <header style="background-color: #9E0612; color: white; padding: 20px; text-align: center;">
              <img src="https://upload.wikimedia.org/wikipedia/vi/a/a0/Logo_vju.svg" alt="Logo VJU" style="height: 60px; margin-bottom: 10px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600;">CỔNG DỊCH VỤ CÔNG TRƯỜNG ĐẠI HỌC VIỆT NHẬT</h1>
              <p style="margin: 5px 0 0; font-size: 13px; opacity: 0.9;">Kết nối, cung cấp thông tin và dịch vụ công mọi lúc, mọi nơi</p>
            </header>
            
            <!-- Main Content -->
            <main style="padding: 25px;">
              <h2 style="color: #dc3545; margin-top: 0; font-size: 18px;">🔔 Đề nghị mới cần được xem xét</h2>
              
              <p style="font-size: 15px; color: #334155;">Kính gửi <strong>Quản lý</strong>,</p>
              <p style="font-size: 15px; color: #334155;">
                Có một đề nghị mới đã được gửi và cần được xem xét để phê duyệt hoặc từ chối.
              </p>

              <!-- Proposal Info Box -->
              <div style="background-color: #fff3cd; padding: 18px; border-radius: 6px; margin: 20px 0; border: 1px solid #ffca2c;">
                <h3 style="color: #856404; margin-top: 0; font-size: 16px;">Thông tin đề nghị</h3>
                <p style="margin: 6px 0; color: #475569;"><strong>Mã đề nghị:</strong> ${proposal.code}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Mã bảo mật:</strong> ${proposal.security_code}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Người gửi:</strong> ${proposal.full_name}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Email:</strong> ${proposal.email}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Số điện thoại:</strong> ${proposal.phone}</p>
                <p style="margin: 6px 0; color: #475569;"><strong>Địa chỉ:</strong> ${proposal.address}</p>
                ${proposal.note ? `<p style="margin: 6px 0; color: #475569;"><strong>Ghi chú:</strong> ${proposal.note}</p>` : ''}
                <p style="margin: 6px 0; color: #475569;"><strong>Trạng thái hiện tại:</strong> <span style="background-color: #ffc107; color: #856404; padding: 2px 8px; border-radius: 3px;">${proposal.status}</span></p>
                <p style="margin: 6px 0; color: #475569;"><strong>Ngày gửi:</strong> ${proposal.created_at.toLocaleDateString('vi-VN')} lúc ${proposal.created_at.toLocaleTimeString('vi-VN')}</p>
              </div>

              <!-- Action Required Box -->
              <div style="background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #721c24;">
                  <strong>Yêu cầu hành động:</strong> Vui lòng đăng nhập vào bảng quản trị để xem xét và xử lý đề nghị này.
                </p>
              </div>

              <!-- Review Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.ADMIN_PANEL_URL || '#'}" 
                   style="background-color: #9E0612; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 600;">
                  Xem xét đề nghị
                </a>
              </div>
              
              <p style="font-size: 15px; color: #334155;">Vui lòng xem xét đề nghị này trong thời gian sớm nhất.</p>
            </main>

            <!-- Footer -->
            <footer style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Đây là thông báo tự động từ hệ thống. Nếu có thắc mắc, vui lòng liên hệ quản trị viên hệ thống.<br>
                Liên hệ: <a href="mailto:admin@vju.edu.vn" style="color: #9E0612; text-decoration: none;">admin@vju.edu.vn</a>
              </p>
            </footer>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Manager notification sent to ${managerEmail}`);
    } catch (error) {
      console.error('Error sending manager notification:', error);
      throw error;
    }
  }
}
