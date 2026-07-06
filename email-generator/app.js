// Document Elements
const emailCanvas = document.getElementById('emailCanvas');
const printBtn = document.getElementById('printBtn');

// Get all form input references
const inputs = ['headerEmail', 'headerWeb', 'headerPhone', 'logoText', 'docTypeTitle', 'companyName', 'companyAddress', 'companyCity', 'letterDate', 'recipientName'].reduce((acc, id) => {
    acc[id] = document.getElementById(id);
    return acc;
}, {});

let isUpdatingFromCanvas = false;

// MAIN EMAIL LETTERHEAD GENERATOR ENGINE
function renderLetter() {
    if (isUpdatingFromCanvas) return;

    const data = Object.keys(inputs).reduce((acc, key) => {
        acc[key] = inputs[key].value;
        return acc;
    }, {});

    // Render continuous, cleanly fragmented elements
    emailCanvas.innerHTML = `
        <div class="brand-banner">
            <div class="brand-logo-box" id="node-logoText">${data.logoText}</div>
            <div class="brand-metadata-row">
                <span id="node-headerEmail">${data.headerEmail}</span> &nbsp;|&nbsp; 
                <span id="node-headerWeb">${data.headerWeb}</span> &nbsp;|&nbsp; 
                <span id="node-headerPhone">${data.headerPhone}</span>
            </div>
        </div>

        <div class="letter-body">
            <div class="letter-main-title" id="node-docTypeTitle">${data.docTypeTitle}</div>
            <hr class="title-separator">

            <div class="meta-address-block">
                <strong>[<span id="node-companyName">${data.companyName}</span>]</strong><br>
                <span id="node-companyAddress">${data.companyAddress}</span><br>
                <span id="node-companyCity">${data.companyCity}</span><br>
                <span id="node-letterDate">${data.letterDate}</span>
            </div>

            <div class="salutation">Dear <span id="node-recipientName">${data.recipientName}</span>,</div>

            <p class="letter-p">Welcome to the team! We are thrilled to have you on board. Your production development skills and passion for innovation make you a perfect fit for this role, and we're confident you'll contribute significantly to our upcoming project launches.</p>
            
            <p class="letter-p">On your first day, please arrive by 9:00 AM at our headquarters. You will be greeted by your shift supervisor, who will guide you through your initial system configuration tasks and responsibilities.</p>
            
            <p class="letter-p">Here's a brief outline of what to expect on your first day:</p>
            <ul class="letter-bullet-list">
                <li><strong>Office Tour:</strong> We'll show you around our facilities and introduce you to key team members.</li>
                <li><strong>Paperwork:</strong> You'll complete important documents such as tax forms, and benefits enrollment.</li>
                <li><strong>Training Schedule:</strong> We will go over your orientation and training schedule layout configurations.</li>
            </ul>

            <p class="letter-p">Please feel free to reach out to us if you have any questions before your start date. We are here to ensure a smooth transition and are excited to support your growth.</p>
            
            <div class="signoff-block">
                Warm regards,<br><br><br>
                <strong>The HR Onboarding Operations Team</strong><br>
                Corporate Support Network
            </div>
        </div>
    `;
}

// TWO-WAY BACK SYNC (Canvas Typing -> Form Input Mapping)
emailCanvas.addEventListener('input', (e) => {
    const target = e.target;
    // Check if the edited element maps to a tracking node ID
    if (target.id && target.id.startsWith('node-')) {
        const inputId = target.id.replace('node-', '');
        const matchedInput = inputs[inputId];
        
        if (matchedInput) {
            isUpdatingFromCanvas = true;
            matchedInput.value = target.innerText.trim();
            isUpdatingFromCanvas = false;
        }
    }
});

// Configure workspace as fully contenteditable
emailCanvas.setAttribute('contenteditable', 'true');

// Attach real-time parsing monitoring to inputs
Object.values(inputs).forEach(input => {
    input.addEventListener('input', renderLetter);
});

// Printer System Hook
printBtn.addEventListener('click', () => {
    window.print();
});

// Initial draw execution
renderLetter();