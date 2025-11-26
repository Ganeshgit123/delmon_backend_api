import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dawajenbahrain@gmail.com',
        pass: "wyuwlojrxshbrfxt",
    },
});

export function getOrderConfirmationEmailBody(customerName: string, orderNumber: number) {
    return `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
            <p>عزيزي/عزيزتي <strong>${customerName}</strong>،</p>
            <p>شكرًا لاختيارك <strong>دجاج المزرعة</strong>.</p>
            <p>يسعدنا إبلاغك بأنه قد تم اعتماد طلبك رقم <strong>#Delmon Order-${orderNumber}</strong> وهو الآن قيد التجهيز.</p>
            <p>سوف يصلك إشعار آخر فور تجهيز وشحن الطلب، سواء للتوصيل أو للاستلام.</p>
            <p>ثقتك محل تقديرنا، ونعدك بالاستمرار في تقديم الأفضل دائمًا.</p>
            <p>مع خالص التحية،<br>شركة دلمون للدواجن<br>📞 هاتف: 17608282</p>
        </div>
        <hr style="margin: 25px 0;">
        <div style="font-family: Arial, sans-serif;">
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>We are pleased to inform you that your order <strong>#Delmon Order-${orderNumber}</strong> has been confirmed and is now being processed.</p>
            <p>You will receive another notification once your order is shipped or ready for pickup.</p>
            <p>Thank you for choosing <strong>Delmon Poultry Company</strong>.</p>
            <p>Best regards,<br>Delmon Poultry Company<br>📞 Tel: 17608282</p>
        </div>
    `;
}

export function getOrderCancelledEmailBody(customerName: string, orderNumber: number) {
    return `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
            <p>عزيزي/عزيزتي <strong>${customerName}</strong>،</p>
            <p>نود إبلاغك بأن طلبك رقم <strong>#Delmon Order-${orderNumber}</strong> قد تم إلغاؤه.</p>
            <p>في حال كان هذا الإلغاء بالخطأ أو كنت ترغب في تقديم طلب جديد، يرجى التواصل معنا وسنكون سعداء بخدمتك.</p>
            <p>شكرًا لتفهمك.</p>
            <p>مع أطيب التحيات،<br>شركة دلمون للدواجن<br>📞 هاتف: 17608282</p>
        </div>
        <hr style="margin: 25px 0;">
        <div style="font-family: Arial, sans-serif;">
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>We would like to inform you that your order <strong>#Delmon Order-${orderNumber}</strong> has been cancelled.</p>
            <p>If this cancellation was made by mistake or you would like to place a new order, please contact us and we will be happy to assist you.</p>
            <p>Thank you for your understanding.</p>
            <p>Best regards,<br>Delmon Poultry Company<br>📞 Tel: 17608282</p>
        </div>
    `;
}

export function getOrderDeliveredEmailBody(customerName: string, orderNumber: number) {
    return `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
            <p>عزيزي/عزيزتي <strong>${customerName}</strong>،</p>
            <p>يسعدنا إبلاغك بأن طلبك رقم <strong>#Delmon Order-${orderNumber}</strong> قد تم توصيله بنجاح.</p>
            <p>في حال كان لديك أي استفسار أو تحتاج إلى مساعدة إضافية، لا تتردد في التواصل معنا.</p>
            <p>شكراً لثقتكم بنا.</p>
            <p>مع أطيب التحيات،<br>شركة دلمون للدواجن<br>📞 هاتف: 17608282</p>
        </div>
        <hr style="margin: 25px 0;">
        <div style="font-family: Arial, sans-serif;">
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>We are pleased to inform you that your order <strong>#Delmon Order-${orderNumber}</strong> has been successfully delivered.</p>
            <p>If you have any questions or need further assistance, please don’t hesitate to contact us.</p>
            <p>Thank you for your trust in us.</p>
            <p>Best regards,<br>Delmon Poultry Company<br>📞 Tel: 17608282</p>
        </div>
    `;
}

export async function sendEmail(to: string, subject: string, html: string) {
    await transporter.sendMail({
        from: `dawajenbahrain@gmail.com`,
        to,
        subject,
        html,
    });
}
