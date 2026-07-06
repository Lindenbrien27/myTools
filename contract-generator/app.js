// Document Elements
const contractCanvas = document.getElementById('contractCanvas');
const printBtn = document.getElementById('printBtn');

// Get all form input references
const inputs = [
    'providerName', 'providerTitle', 'providerEmail',
    'clientOrg', 'clientRep', 'contractDate',
    'schedulingTool', 'videoSuite', 'storageLocation', 'surveyTool'
].reduce((acc, id) => {
    acc[id] = document.getElementById(id);
    return acc;
}, {});

// MAIN CONTRACT RENDER ENGINE
function renderContract() {
    // Collect profile data values
    const data = Object.keys(inputs).reduce((acc, key) => {
        acc[key] = inputs[key].value;
        return acc;
    }, {});

    // Construct the structured contract cleanly fragmented into Page 1 and Page 2 blocks
    contractCanvas.innerHTML = `
        <!-- PAGE 1 BLOCK -->
        <div class="page">
            <div class="doc-title">OPERATIONAL MASTER AGREEMENT</div>
            <div class="doc-subtitle">CLIENT ONBOARDING PROTOCOLS & SERVICE FRAMEWORK</div>

            <div class="meta-split">
                <div class="meta-col">
                    <span class="meta-label">Prepared By</span>
                    <strong>${data.providerName}</strong>
                    <span>${data.providerTitle}</span>
                    <span>Email: ${data.providerEmail}</span>
                </div>
                <div class="meta-col">
                    <span class="meta-label">Prepared For</span>
                    <strong>${data.clientOrg}</strong>
                    <span>Attn: ${data.clientRep}</span>
                    <span>Date: ${data.contractDate}</span>
                </div>
            </div>

            <p class="doc-p">This operational infrastructure statement and binding covenant details the systematic onboarding procedures, legal boundaries, and fulfillment milestones governing the collaborative engagement between the parties. By executing this document, both parties establish a reliable mechanism ensuring clear communication and operational integrity.</p>

            <div class="doc-section-title">1. Framework Foundations & Sequential Flow</div>
            <p class="doc-p">The engagement follows an ordered structure to manage deadlines, align core expectations, and ensure complete data accuracy across all task execution points:</p>

            <div class="phase-block">
                <div class="phase-title">Phase 1: Legal Protection & Financial Alignment</div>
                <p class="doc-p"><strong>Contractual Bindings:</strong> An executed agreement must reside in active systems prior to initiating workflows. This structure establishes a protective boundary for corporate assets and independent contractor timelines.</p>
                <p class="doc-p"><strong>Transparent Invoicing:</strong> Clear itemization of technical resources, retainer parameters, and ongoing fees guarantees structural visibility and builds absolute client trust.</p>
            </div>

            <div class="phase-block">
                <div class="phase-title">Phase 2: System Integration & Communication Onboarding</div>
                <p class="doc-p"><strong>The Welcome Documentation:</strong> Contains definitive process flowcharts, communication schedules, standard operating environments, and emergency support channels.</p>
                <p class="doc-p"><strong>Formal Request for Access:</strong> Delivered to systematically acquire credential clearances, storage locations, and active Email Service Provider (ESP) sequences safely.</p>
                <p class="doc-p"><strong>Synchronized Kickoff Call:</strong> Set via standardized scheduling platforms (e.g., ${data.schedulingTool}) and conducted over enterprise video suites (${data.videoSuite}) to finalize immediate priorities.</p>
            </div>

            <div class="doc-footer">
                <span>Confidential Business Proposal & Onboarding System</span>
                <span>Page 1 of 2</span>
            </div>
        </div>

        <!-- PAGE 2 BLOCK -->
        <div class="page">
            <div class="doc-section-title" style="margin-top: 0;">2. Transparency, Central Portals & Long-Term Retention</div>
            <p class="doc-p">Operational execution avoids fractured communication through a central infrastructure framework:</p>
            
            <ul class="bullet-list">
                <li><strong>Unified Client Portal:</strong> Serves as the single source of truth, yielding exhaustive transparency regarding live project timelines, upcoming deliverables, and collaborative review states.</li>
                <li><strong>Fulfillment & Asset Governance:</strong> Delivery utilizes organized ${data.storageLocation} standard directories mapped comprehensively inside the portal to guarantee intuitive architecture.</li>
                <li><strong>Metric Reporting & Feedback loops:</strong> Standardized monthly summaries are maintained natively in the portal and delivered over verified channels. Upon reaching standard delivery milestones, feedback evaluation surveys (e.g., ${data.surveyTool}) are utilized to capture accurate performance evaluations.</li>
            </ul>

            <div class="doc-section-title">3. Formal Execution Mandate</div>
            <div class="directive-box">
                <strong>OPERATIONAL DIRECTIVE:</strong> No production assets shall change, no technical configurations shall be executed, and no system accesses shall be authorized or used until this Master Agreement is formally signed by both parties and the initial invoice has cleared banking confirmation loops.
            </div>

            <p class="doc-p">By applying signatures below, both parties confirm adherence to the onboarding systems, payment requirements, and protective operational terms contained within this framework.</p>

            <div class="signature-container">
                <div class="sig-line">
                    <div class="sig-space"></div>
                    <div class="sig-info">
                        <strong>${data.providerName}</strong><br>
                        <span>Independent Service Provider</span><br>
                        <span>Date: ________________________</span>
                    </div>
                </div>
                <div class="sig-line">
                    <div class="sig-space"></div>
                    <div class="sig-info">
                        <strong>${data.clientRep}</strong><br>
                        <span>For: ${data.clientOrg}</span><br>
                        <span>Date: ________________________</span>
                    </div>
                </div>
            </div>

            <div class="doc-footer">
                <span>Confidential Business Proposal & Onboarding System</span>
                <span>Page 2 of 2</span>
            </div>
        </div>
    `;
}

// Listen to all inputs for real-time compilation mapping changes
Object.values(inputs).forEach(input => {
    input.addEventListener('input', renderContract);
});

// Native Device Printer Trigger Hook
printBtn.addEventListener('click', () => {
    window.print();
});

// Run an initial compile build on file initialization
renderContract();