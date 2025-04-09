document.addEventListener('DOMContentLoaded', function() {
    // Generate receipt number if empty
    const receiptNoField = document.getElementById('receiptNo');
    if (!receiptNoField.value) {
        generateReceiptNumber();
    }

    // Set today's date as default for receipt date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('receiptDate').value = today;

    // Toggle GST field visibility
    const applyGstCheckbox = document.getElementById('applyGst');
    const gstField = document.querySelector('.gst-field');
    const gstRow = document.querySelector('.gst-row');

    applyGstCheckbox.addEventListener('change', function() {
        if (this.checked) {
            gstField.style.display = 'block';
            gstRow.style.display = 'flex';
        } else {
            gstField.style.display = 'none';
            gstRow.style.display = 'none';
        }
        calculateTotals();
    });

    // Calculate button functionality
    document.getElementById('calculateBtn').addEventListener('click', calculateTotals);

    // Generate Receipt button functionality
    document.getElementById('generateReceiptBtn').addEventListener('click', generateReceipt);

    // Save to Excel button functionality
    document.getElementById('saveDataBtn').addEventListener('click', saveToExcel);

    // Send via WhatsApp button functionality
    document.getElementById('sendWhatsAppBtn').addEventListener('click', sendViaWhatsApp);

    // Save as PDF button functionality
    document.getElementById('savePdfBtn').addEventListener('click', saveAsPdf);

    // Calculate totals when any fee field changes
    const feeInputs = document.querySelectorAll('#tuitionFee, #libraryFee, #hostelFee, #examFee, #miscFee, #discount, #gstPercent');
    feeInputs.forEach(input => {
        input.addEventListener('input', calculateTotals);
    });

    // Generate new receipt number when date changes
    document.getElementById('receiptDate').addEventListener('change', function() {
        if (!receiptNoField.value || receiptNoField.value.startsWith('JMK-')) {
            generateReceiptNumber();
        }
    });
});

function generateReceiptNumber() {
    const receiptDate = document.getElementById('receiptDate').value;
    const datePart = receiptDate ? receiptDate.replace(/-/g, '').substring(2) : '';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('receiptNo').value = `JMK-${datePart}-${randomNum}`;
}

function calculateTotals() {
    // Get all fee values
    const tuitionFee = parseFloat(document.getElementById('tuitionFee').value) || 0;
    const libraryFee = parseFloat(document.getElementById('libraryFee').value) || 0;
    const hostelFee = parseFloat(document.getElementById('hostelFee').value) || 0;
    const examFee = parseFloat(document.getElementById('examFee').value) || 0;
    const miscFee = parseFloat(document.getElementById('miscFee').value) || 0;

    // Calculate subtotal
    const subtotal = tuitionFee + libraryFee + hostelFee + examFee + miscFee;
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;

    // Calculate discount
    const discountPercent = parseFloat(document.getElementById('discount').value) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    document.getElementById('discountAmount').textContent = `₹${discountAmount.toFixed(2)}`;

    // Calculate GST if applied
    let gstAmount = 0;
    const applyGst = document.getElementById('applyGst').checked;
    
    if (applyGst) {
        const gstPercent = parseFloat(document.getElementById('gstPercent').value) || 0;
        document.getElementById('gstPercentage').textContent = gstPercent;
        gstAmount = (subtotal - discountAmount) * (gstPercent / 100);
        document.getElementById('gstAmount').textContent = `₹${gstAmount.toFixed(2)}`;
    }

    // Calculate grand total
    const grandTotal = subtotal - discountAmount + gstAmount;
    document.getElementById('grandTotal').textContent = `₹${grandTotal.toFixed(2)}`;
}

function generateReceipt() {
    // Validate form
    if (!validateForm()) return;

    // First calculate totals to ensure they're up to date
    calculateTotals();

    // Get all form values
    const studentName = document.getElementById('studentName').value;
    const fatherName = document.getElementById('fatherName').value;
    const mobile = document.getElementById('mobile').value;
    const receiptNo = document.getElementById('receiptNo').value;
    const course = document.getElementById('course').value;
    const admissionYear = document.getElementById('admissionYear').value;
    const feeFor = document.getElementById('feeFor').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const receiptDate = document.getElementById('receiptDate').value;
    const dueDate = document.getElementById('dueDate').value || 'N/A';

    // Get fee values
    const tuitionFee = parseFloat(document.getElementById('tuitionFee').value) || 0;
    const libraryFee = parseFloat(document.getElementById('libraryFee').value) || 0;
    const hostelFee = parseFloat(document.getElementById('hostelFee').value) || 0;
    const examFee = parseFloat(document.getElementById('examFee').value) || 0;
    const miscFee = parseFloat(document.getElementById('miscFee').value) || 0;

    // Get calculation results
    const subtotal = document.getElementById('subtotal').textContent.replace('₹', '');
    const discountAmount = document.getElementById('discountAmount').textContent.replace('₹', '');
    const gstAmount = document.getElementById('gstAmount').textContent.replace('₹', '');
    const grandTotal = document.getElementById('grandTotal').textContent.replace('₹', '');
    const applyGst = document.getElementById('applyGst').checked;
    const gstPercent = applyGst ? document.getElementById('gstPercent').value : '0';

    // Format dates
    const formattedReceiptDate = formatDate(receiptDate);
    const formattedDueDate = dueDate === 'N/A' ? 'N/A' : formatDate(dueDate);

    // Create receipt HTML
    const receiptHTML = `
        <div class="receipt">
            <div class="receipt-header">
                <h1>J.M.K. Group of College</h1>
                <p>M.S. Road, Sabalgarh, Morena (M.P.) - GSTIN: 22AAAAA0000A125</p>
                <p>+91 9754441122, 9754441133 | jmkgroupcollage@gmail.com</p>
                <h2>FEE RECEIPT</h2>
            </div>

            <div class="receipt-details">
                <div class="receipt-student-info">
                    <p><strong>Receipt No:</strong> ${receiptNo}</p>
                    <p><strong>Date:</strong> ${formattedReceiptDate}</p>
                    <p><strong>Due Date:</strong> ${formattedDueDate}</p>
                    <p><strong>Student Name:</strong> ${studentName}</p>
                    <p><strong>Father's Name:</strong> ${fatherName}</p>
                    <p><strong>Mobile:</strong> ${mobile}</p>
                </div>
                <div class="receipt-fee-info">
                    <p><strong>Course:</strong> ${course}</p>
                    <p><strong>Admission Year:</strong> ${admissionYear}</p>
                    <p><strong>Fee For:</strong> ${feeFor}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                </div>
            </div>

            <table class="receipt-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tuition Fee</td>
                        <td>${tuitionFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Library Fee</td>
                        <td>${libraryFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Hostel Fee</td>
                        <td>${hostelFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Exam Fee</td>
                        <td>${examFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Miscellaneous Fee</td>
                        <td>${miscFee.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <div class="receipt-totals">
                <div>
                    <span>Subtotal:</span>
                    <span>₹${subtotal}</span>
                </div>
                <div>
                    <span>Discount:</span>
                    <span>₹${discountAmount}</span>
                </div>
                ${applyGst ? `
                <div>
                    <span>GST (${gstPercent}%):</span>
                    <span>₹${gstAmount}</span>
                </div>
                ` : ''}
                <div class="total">
                    <span>Grand Total:</span>
                    <span>₹${grandTotal}</span>
                </div>
            </div>

            <div class="receipt-footer">
                <div class="receipt-signature">
                    <p>Authorized Signature</p>
                    <p>_________________________</p>
                    <p>J.M.K. Group of College</p>
                </div>
                <div class="receipt-qrcode" id="receiptQrCode">
                    <p>Scan to pay online</p>
                </div>
            </div>

            <div class="receipt-terms">
                <h4>Terms & Conditions:</h4>
                <ol>
                    <li>Fees once paid are non-refundable.</li>
                    <li>Late payments may incur a penalty of ₹50 per day.</li>
                    <li>All disputes are subject to Morena jurisdiction.</li>
                    <li>Original receipt must be produced for any fee-related queries.</li>
                    <li>College rules and regulations must be followed by all students.</li>
                </ol>
            </div>
        </div>
    `;

    // Display receipt in container
    const receiptContainer = document.getElementById('receiptContainer');
    const printableReceipt = document.getElementById('printableReceipt');
    printableReceipt.innerHTML = receiptHTML;
    receiptContainer.style.display = 'block';

    // Generate QR code
    const qrCodeDiv = document.getElementById('receiptQrCode');
    qrCodeDiv.innerHTML = '<p>Scan to pay online</p>'; // Clear previous QR code
    new QRCode(qrCodeDiv, {
        text: `J.M.K. College Fee Payment\nStudent: ${studentName}\nAmount: ₹${grandTotal}\nReceipt No: ${receiptNo}`,
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Return the receipt container for PDF generation
    return receiptContainer;
}

async function saveAsPdf() {
    try {
        // First generate receipt (but don't print)
        const receiptContainer = generateReceipt();
        
        if (!receiptContainer) return; // Validation failed
        
        // Wait for QR code to generate and rendering to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Use html2canvas to capture receipt as image
        const canvas = await html2canvas(receiptContainer, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
        });

        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`JMK_Fee_Receipt_${document.getElementById('receiptNo').value}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

function saveToExcel() {
    // Validate form
    if (!validateForm()) return;

    // First calculate totals to ensure they're up to date
    calculateTotals();

    // Get all form values
    const studentName = document.getElementById('studentName').value;
    const fatherName = document.getElementById('fatherName').value;
    const mobile = document.getElementById('mobile').value;
    const receiptNo = document.getElementById('receiptNo').value;
    const course = document.getElementById('course').value;
    const admissionYear = document.getElementById('admissionYear').value;
    const feeFor = document.getElementById('feeFor').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const receiptDate = document.getElementById('receiptDate').value;
    const dueDate = document.getElementById('dueDate').value || 'N/A';

    // Get fee values
    const tuitionFee = parseFloat(document.getElementById('tuitionFee').value) || 0;
    const libraryFee = parseFloat(document.getElementById('libraryFee').value) || 0;
    const hostelFee = parseFloat(document.getElementById('hostelFee').value) || 0;
    const examFee = parseFloat(document.getElementById('examFee').value) || 0;
    const miscFee = parseFloat(document.getElementById('miscFee').value) || 0;

    // Get calculation results
    const subtotal = document.getElementById('subtotal').textContent.replace('₹', '');
    const discountAmount = document.getElementById('discountAmount').textContent.replace('₹', '');
    const gstAmount = document.getElementById('gstAmount').textContent.replace('₹', '');
    const grandTotal = document.getElementById('grandTotal').textContent.replace('₹', '');
    const applyGst = document.getElementById('applyGst').checked;
    const gstPercent = applyGst ? document.getElementById('gstPercent').value : '0';

    // Try to get existing data from localStorage
    let allReceipts = [];
    const storedData = localStorage.getItem('jmkFeeReceipts');
    if (storedData) {
        allReceipts = JSON.parse(storedData);
    }

    // Create new receipt data
    const newReceipt = {
        receiptNo,
        receiptDate,
        studentName,
        fatherName,
        mobile,
        course,
        admissionYear,
        feeFor,
        tuitionFee,
        libraryFee,
        hostelFee,
        examFee,
        miscFee,
        subtotal,
        discount: document.getElementById('discount').value,
        discountAmount,
        applyGst,
        gstPercent,
        gstAmount,
        grandTotal,
        paymentMethod,
        dueDate,
        generatedAt: new Date().toISOString()
    };

    // Add new receipt to array
    allReceipts.push(newReceipt);

    // Save back to localStorage
    localStorage.setItem('jmkFeeReceipts', JSON.stringify(allReceipts));

    // Create data array for Excel
    const excelData = [
        ["J.M.K. Group of College - Fee Receipts Data"],
        ["Generated on:", new Date().toLocaleString()],
        [],
        ["Receipt No", "Date", "Student Name", "Father's Name", "Mobile", "Course", 
         "Admission Year", "Fee For", "Tuition Fee", "Library Fee", "Hostel Fee", 
         "Exam Fee", "Misc Fee", "Subtotal", "Discount %", "Discount Amt", 
         "GST %", "GST Amt", "Grand Total", "Payment Method", "Due Date"]
    ];

    // Add all receipts to Excel data
    allReceipts.forEach(receipt => {
        excelData.push([
            receipt.receiptNo,
            formatDate(receipt.receiptDate),
            receipt.studentName,
            receipt.fatherName,
            receipt.mobile,
            receipt.course,
            receipt.admissionYear,
            receipt.feeFor,
            receipt.tuitionFee,
            receipt.libraryFee,
            receipt.hostelFee,
            receipt.examFee,
            receipt.miscFee,
            receipt.subtotal,
            receipt.discount,
            receipt.discountAmount,
            receipt.applyGst ? receipt.gstPercent : '0',
            receipt.applyGst ? receipt.gstAmount : '0',
            receipt.grandTotal,
            receipt.paymentMethod,
            receipt.dueDate === 'N/A' ? 'N/A' : formatDate(receipt.dueDate)
        ]);
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fee Receipts");

    // Generate Excel file
    const fileName = `JMK_Fee_Receipts_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    // Show success message
    alert('All receipt data has been saved to Excel file successfully!');
}

function sendViaWhatsApp() {
    // Validate form
    if (!validateForm()) return;

    // First calculate totals to ensure they're up to date
    calculateTotals();

    // Get student details
    const studentName = document.getElementById('studentName').value;
    const mobile = document.getElementById('mobile').value;
    const receiptNo = document.getElementById('receiptNo').value;
    const grandTotal = document.getElementById('grandTotal').textContent;

    // Create message
    const message = `Dear ${studentName},\n\nYour fee payment of ${grandTotal} has been received.\nReceipt No: ${receiptNo}\n\nThank you,\nJ.M.K. Group of College`;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${mobile}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

function validateForm() {
    // Check required fields
    const requiredFields = [
        'studentName', 'fatherName', 'mobile', 'receiptNo', 
        'course', 'admissionYear', 'feeFor', 'paymentMethod', 'receiptDate'
    ];

    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            alert(`Please fill in ${field.labels[0].textContent}`);
            field.focus();
            return false;
        }
    }

    // Validate mobile number
    const mobile = document.getElementById('mobile').value;
    if (!/^\d{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        document.getElementById('mobile').focus();
        return false;
    }

    // Check terms agreement
    if (!document.getElementById('agreeTerms').checked) {
        alert('Please agree to the terms and conditions');
        return false;
    }

    return true;
}

function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}