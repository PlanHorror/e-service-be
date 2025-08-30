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
      subject: 'Proposal Created Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Proposal Created Successfully</h2>
          
          <p>Dear ${proposal.full_name},</p>
          
          <p>Your proposal has been created successfully. Here are the details:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Proposal Details</h3>
            <p><strong>Proposal Code:</strong> ${proposal.code}</p>
            <p><strong>Security Code:</strong> ${proposal.security_code}</p>
            <p><strong>Full Name:</strong> ${proposal.full_name}</p>
            <p><strong>Email:</strong> ${proposal.email}</p>
            <p><strong>Phone:</strong> ${proposal.phone}</p>
            <p><strong>Address:</strong> ${proposal.address}</p>
            ${proposal.note ? `<p><strong>Note:</strong> ${proposal.note}</p>` : ''}
            <p><strong>Status:</strong> ${proposal.status}</p>
            <p><strong>Created At:</strong> ${proposal.created_at.toLocaleDateString()}</p>
          </div>
          
          <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
            <p style="margin: 0;"><strong>Important:</strong> Please keep your proposal code and security code safe. You will need them to track your proposal status.</p>
          </div>
          
          <p>Your proposal is currently under review. You will be notified of any updates.</p>
          
          <p>Thank you for your submission!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
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
      subject: 'New Proposal Requires Review',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">New Proposal Requires Review</h2>
          
          <p>Dear Manager,</p>
          
          <p>A new proposal has been submitted and requires your review for approval or denial.</p>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">Proposal Information</h3>
            <p><strong>Proposal Code:</strong> ${proposal.code}</p>
            <p><strong>Security Code:</strong> ${proposal.security_code}</p>
            <p><strong>Submitter:</strong> ${proposal.full_name}</p>
            <p><strong>Email:</strong> ${proposal.email}</p>
            <p><strong>Phone:</strong> ${proposal.phone}</p>
            <p><strong>Address:</strong> ${proposal.address}</p>
            ${proposal.note ? `<p><strong>Note:</strong> ${proposal.note}</p>` : ''}
            <p><strong>Current Status:</strong> <span style="background-color: #ffc107; color: #856404; padding: 2px 8px; border-radius: 3px;">${proposal.status}</span></p>
            <p><strong>Submitted At:</strong> ${proposal.created_at.toLocaleDateString()} at ${proposal.created_at.toLocaleTimeString()}</p>
          </div>
          
          <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545;">
            <p style="margin: 0;"><strong>Action Required:</strong> Please log in to the admin panel to review and process this proposal.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.ADMIN_PANEL_URL || '#'}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Review Proposal
            </a>
          </div>
          
          <p>Please review this proposal at your earliest convenience.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 12px;">
            This is an automated notification. If you have any questions, please contact the system administrator.
          </p>
        </div>
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
