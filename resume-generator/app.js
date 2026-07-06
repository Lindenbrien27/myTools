// Document Elements
const resumeCanvas = document.getElementById('resumeCanvas');
const printBtn = document.getElementById('printBtn');

const inputs = [
    'fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin',
    'summary', 'skills', 'experience', 'education'
].reduce((acc, id) => {
    acc[id] = document.getElementById(id);
    return acc;
}, {});

function buildBulletList(text) {
    if (!text) return '';
    return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<li>${line.replace(/^•\s*/, '')}</li>`)
        .join('');
}

function parseBlockContent(rawText, isExperience = true) {
    if (!rawText) return '';
    
    const records = rawText.split('\n\n').map(rec => rec.trim()).filter(rec => rec.length > 0);
    
    return records.map(record => {
        const lines = record.split('\n');
        const headerInfo = lines[0].split('|').map(s => s.trim());
        
        const titleOrDegree = headerInfo[0] || '';
        const companyOrSchool = headerInfo[1] || '';
        const dateRange = headerInfo[2] || '';
        
        const bulletsText = lines.slice(1).join('\n');
        
        return `
            <div class="res-block">
                <div class="res-block-header">
                    <span>${titleOrDegree}</span>
                    <span>${dateRange}</span>
                </div>
                <div class="res-block-sub">
                    <span>${companyOrSchool}</span>
                </div>
                ${bulletsText ? `<ul class="res-bullets">${buildBulletList(bulletsText)}</ul>` : ''}
            </div>
        `;
    }).join('');
}

function renderResume() {
    const profile = Object.keys(inputs).reduce((acc, key) => {
        acc[key] = inputs[key].value;
        return   acc;
    }, {});

    const contactRow = [profile.email, profile.phone, profile.location, profile.linkedin]
        .filter(val => val.trim().length > 0)
        .join('  |  ');

    resumeCanvas.innerHTML = `
        <header class="res-header">
            <div class="res-name">${profile.fullName}</div>
            <div class="res-title">${profile.jobTitle}</div>
            <div class="res-contact">${contactRow}</div>
        </header>

        ${profile.summary ? `
            <section>
                <div class="res-section-title">Professional Summary</div>
                <p class="res-summary">${profile.summary}</p>
            </section>
        ` : ''}

        ${profile.skills ? `
            <section>
                <div class="res-section-title">Core Competencies</div>
                <p class="res-skills">${profile.skills.split(',').map(s => s.trim()).join(' &nbsp;•&nbsp; ')}</p>
            </section>
        ` : ''}

        ${profile.experience ? `
            <section>
                <div class="res-section-title">Professional Experience</div>
                ${parseBlockContent(profile.experience, true)}
            </section>
        ` : ''}

        ${profile.education ? `
            <section>
                <div class="res-section-title">Education</div>
                ${parseBlockContent(profile.education, false)}
            </section>
        ` : ''}
    `;
}

Object.values(inputs).forEach(input => {
    input.addEventListener('input', renderResume);
});


printBtn.addEventListener('click', () => {
    window.print();
});

renderResume();