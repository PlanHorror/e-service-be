import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Proposal, ProposalReview } from '@prisma/client';
import { PrismaService } from '../prisma.service';

// Define type for proposal with documents
type ProposalWithDocuments = Proposal & {
  documents?: Array<{
    id: string;
    pass: boolean;
    document?: {
      id: string;
      name: string;
    };
  }>;
};

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private emailQueue: Array<{
    to: string;
    subject: string;
    html: string;
  }> = [];
  private isProcessing = false;

  constructor(private readonly prisma: PrismaService) {
    // Use connection pooling for better performance
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14, // emails per second
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Process queue every 500ms
    setInterval(() => this.processEmailQueue(), 500);
  }

  private async processEmailQueue() {
    if (this.isProcessing || this.emailQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      // Process up to 3 emails at once
      const batch = this.emailQueue.splice(0, 3);
      
      await Promise.all(
        batch.map(async (emailData) => {
          try {
            await this.transporter.sendMail(emailData);
            console.log(`Email sent to ${emailData.to}`);
          } catch (error) {
            console.error(`Failed to send email to ${emailData.to}:`, error);
          }
        })
      );
    } finally {
      this.isProcessing = false;
    }
  }

  private addToQueue(to: string, subject: string, html: string) {
    this.emailQueue.push({ to, subject, html });
  }

  private async getManagerEmails(): Promise<string[]> {
    try {
      const managers = await this.prisma.user.findMany({
        where: {
          role: {
            in: ['MANAGER', 'ADMIN'],
          },
          is_active: true,
        },
        select: {
          email: true,
        },
      });

      return managers.map(manager => manager.email);
    } catch (error) {
      console.error('Error fetching manager emails:', error);
      // Fallback to environment variable if database query fails
      return process.env.MANAGER_EMAIL ? [process.env.MANAGER_EMAIL] : [];
    }
  }

  async sendProposalCreationConfirmation(proposal: Proposal): Promise<void> {
    const html = `
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
              <img src="https://vju.vnu.edu.vn/wp-content/uploads/2023/07/logo-2.png" alt="Logo VJU" style="height: 60px; margin-bottom: 10px;">
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
              <p style="font-size: 15px; color: #334155;">Xin cảm ọn bạn đã sử dụng dịch vụ!</p>
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
      `;

    this.addToQueue(
      proposal.email,
      'Xác Nhận Đề Nghị - VJU E-Service',
      html
    );
  }

  async sendManagerNotification(proposal: Proposal): Promise<void> {
    // Get all manager/admin emails from database
    const managerEmails = await this.getManagerEmails();
    
    if (managerEmails.length === 0) {
      console.warn('No manager emails found. Cannot send manager notification.');
      return;
    }

    const html = `
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
              <img src="https://vju.vnu.edu.vn/wp-content/uploads/2023/07/logo-2.png" alt="Logo VJU" style="height: 60px; margin-bottom: 10px;">
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
      `;

    // Send email to all managers/admins using queue
    managerEmails.forEach(email => {
      this.addToQueue(
        email,
        'Thông Báo Đề Nghị Mới - VJU E-Service',
        html
      );
    });

    console.log(`Manager notifications queued for ${managerEmails.length} recipients: ${managerEmails.join(', ')}`);
  }

  async sendReviewNotification(proposal: ProposalWithDocuments, review: ProposalReview): Promise<void> {
    const statusText = review.accepted ? 'Đã được phê duyệt' : 'Đã bị từ chối';
    const statusColor = review.accepted ? '#28a745' : '#dc3545';
    const subject = review.accepted ? 'Đề Nghị Đã Được Phê Duyệt - VJU E-Service' : 'Đề Nghị Đã Bị Từ Chối - VJU E-Service';

    // Generate documents table if documents exist
    const documentsTable = proposal.documents && proposal.documents.length > 0 ? `
      <h3 style="color: #2c3e50; font-size: 16px; margin-top: 25px; margin-bottom: 15px;">📋 Chi tiết tài liệu:</h3>
      <div style="overflow-x: auto; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; color: #475569; font-weight: 600; font-size: 14px;">Loại tài liệu</th>
              <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; color: #475569; font-weight: 600; font-size: 14px;">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            ${proposal.documents.map((doc, index) => `
              <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                <td style="border: 1px solid #e2e8f0; padding: 12px; color: #334155; font-size: 14px;">${doc.document?.name || 'Tài liệu không xác định'}</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">
                  <span style="color: ${doc.pass ? '#28a745' : '#dc3545'}; font-weight: bold; background: ${doc.pass ? '#d4edda' : '#f8d7da'}; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: uppercase;">
                    ${doc.pass ? '✓ Đã duyệt' : '✗ Từ chối'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '';

    // Generate summary for rejected documents
    const rejectedDocs = proposal.documents?.filter(doc => !doc.pass) || [];
    const rejectedDocsSummary = rejectedDocs.length > 0 ? `
      <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0;">
        <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 14px;">⚠️ Tài liệu bị từ chối (${rejectedDocs.length}):</h4>
        <ul style="margin: 0; padding-left: 20px; color: #856404;">
          ${rejectedDocs.map(doc => `<li style="margin: 4px 0; font-size: 13px;">${doc.document?.name || 'Tài liệu không xác định'}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    const html = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thông Báo Review</title>
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0;">
          <div style="max-width: 650px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">

            <!-- Header -->
            <header style="background-color: #9E0612; color: white; padding: 20px; text-align: center;">
              <img src="https://vju.vnu.edu.vn/wp-content/uploads/2023/07/logo-2.png" alt="Logo VJU" style="height: 60px; margin-bottom: 10px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600;">CỔNG DỊCH VỤ CÔNG TRƯỜNG ĐẠI HỌC VIỆT NHẬT</h1>
              <p style="margin: 5px 0 0; font-size: 13px; opacity: 0.9;">Kết nối, cung cấp thông tin và dịch vụ công mọi lúc, mọi nơi</p>
            </header>
            
            <!-- Main Content -->
            <main style="padding: 25px;">
              <h2 style="color: ${statusColor}; margin-top: 0; font-size: 18px;">📄 Đề nghị của bạn ${statusText}</h2>
              
              <p style="font-size: 15px; color: #334155;">Kính gửi <strong>${proposal.full_name}</strong>,</p>
              <p style="font-size: 15px; color: #334155;">
                Đề nghị của bạn đã được xem xét. Thông tin chi tiết như sau:
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
                <p style="margin: 6px 0; color: #475569;"><strong>Trạng thái:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
                <p style="margin: 6px 0; color: #475569;"><strong>Ngày tạo:</strong> ${proposal.created_at.toLocaleDateString('vi-VN')}</p>
                ${review.comments ? `<p style="margin: 6px 0; color: #475569;"><strong>Ghi chú từ reviewer:</strong> ${review.comments}</p>` : ''}
              </div>

              ${documentsTable}
              ${rejectedDocsSummary}

              <!-- Alert Box -->
              <div style="background: ${review.accepted ? '#d4edda' : '#f8d7da'}; padding: 15px; border-radius: 6px; border-left: 4px solid ${statusColor}; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: ${review.accepted ? '#155724' : '#721c24'};">
                  <strong>${review.accepted ? 'Chúc mừng!' : 'Lưu ý:'}</strong> ${review.accepted ? 'Đề nghị của bạn đã được phê duyệt. Bạn sẽ nhận thêm hướng dẫn nếu cần.' : 'Đề nghị của bạn đã bị từ chối. Vui lòng kiểm tra các tài liệu bị từ chối và gửi lại nếu cần.'}
                </p>
              </div>
              
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
      `;

    this.addToQueue(proposal.email, subject, html);
  }
}