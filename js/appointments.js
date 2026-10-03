document.addEventListener("DOMContentLoaded", () => {
    const table=document.querySelector(".patient-table tbody");
    const search=document.querySelector('.search-box input');
    const newBtn=[...document.querySelectorAll('.hero-right button')].find(b=>/new appointment/i.test(b.textContent));
    const cards=[...document.querySelectorAll('.cards .card')];
    let appointments=[], patients=[], doctors=[];

    const esc=v=>String(v??"").replace(/[&<>\"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
    const formatDate=v=>v?new Date(v).toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'}):"—";
    const statusClass=s=>String(s||'').toLowerCase().replace(/\s+/g,'-');

    async function load(){
        try{
            const [a,p,u,st]=await Promise.all([apiRequest('/appointments?limit=100'),apiRequest('/patients?limit=100'),apiRequest('/auth/doctors'),apiRequest('/appointments/stats')]);
            appointments=a.appointments||[]; patients=p.patients||[]; doctors=u.users||[];
            render();
            const x=st.statistics||st.stats||{};
            const vals=[x.todayAppointments??appointments.filter(a=>new Date(a.appointmentDate).toDateString()===new Date().toDateString()).length,x.availableDoctors??doctors.length,x.pendingAppointments??appointments.filter(a=>a.status==='Scheduled').length,x.emergencyAppointments??appointments.filter(a=>a.appointmentType==='Emergency').length];
            cards.forEach((c,i)=>{const h=c.querySelector('h2');if(h)h.textContent=vals[i]??0});
            renderSchedule(); renderCalendar();
        }catch(e){ if(table)table.innerHTML=`<tr><td colspan="6"><div class="cs-error">${esc(e.message)}</div></td></tr>`; }
    }
    function render(){
        if(!table)return; const q=(search?.value||'').toLowerCase();
        const list=appointments.filter(a=>`${a.appointmentId} ${a.patient?.firstName||''} ${a.patient?.lastName||''} ${a.doctor?.fullName||''} ${a.department||''}`.toLowerCase().includes(q));
        table.innerHTML=list.length?list.map(a=>`<tr><td><div class="patient"><div><h4>${esc(a.patient?`${a.patient.firstName} ${a.patient.lastName}`:'Unknown')}</h4><p>${esc(a.appointmentId)}</p></div></div></td><td>${esc(a.doctor?.fullName)}</td><td>${esc(a.department)}</td><td>${esc(formatDate(a.appointmentDate))} ${esc(a.appointmentTime)}</td><td><span class="status-badge ${statusClass(a.status)}">${esc(a.status)}</span></td><td><div class="cs-actions"><button class="cs-btn-small" data-action="view" data-id="${a._id}">View</button>${a.status==='Scheduled'?`<button class="cs-btn-small danger" data-action="cancel" data-id="${a._id}">Cancel</button>`:''}</div></td></tr>`).join(''):`<tr><td colspan="6"><div class="cs-empty">No appointments found.</div></td></tr>`;
        table.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action,b.dataset.id));
    }
    async function action(type,id){
        const a=appointments.find(x=>x._id===id); if(!a)return;
        if(type==='view'){ alert(`Appointment ${a.appointmentId}\nPatient: ${a.patient?.firstName||''} ${a.patient?.lastName||''}\nDoctor: ${a.doctor?.fullName||''}\nDate: ${formatDate(a.appointmentDate)} ${a.appointmentTime}\nStatus: ${a.status}`); return; }
        if(type==='cancel' && confirm('Cancel this appointment?')){ try{await apiRequest(`/appointments/${id}/cancel`,{method:'PUT',body:JSON.stringify({reason:'Cancelled from dashboard'})});showToast('Appointment cancelled');load();}catch(e){showToast(e.message,'error');} }
    }
    function renderSchedule(){const box=document.querySelector('.schedule-panel .chart-card');if(!box)return;const today=new Date().toDateString();const list=appointments.filter(a=>new Date(a.appointmentDate).toDateString()===today).sort((a,b)=>String(a.appointmentTime).localeCompare(String(b.appointmentTime))).slice(0,8);box.innerHTML=`<h3>Today's Schedule</h3>${list.length?list.map(a=>`<div class="schedule-item"><div class="schedule-time">${esc(a.appointmentTime)}</div><div><h4>${esc(a.patient?`${a.patient.firstName} ${a.patient.lastName}`:'Patient')}</h4><p>${esc(a.department)} • ${esc(a.status)}</p></div></div>`).join(''):'<div class="cs-empty">No appointments today.</div>'}`}
    function renderCalendar(){document.querySelectorAll('.calendar .day').forEach(d=>{const n=Number(d.textContent.trim());if(!n)return;const has=appointments.some(a=>{const x=new Date(a.appointmentDate);return x.getDate()===n&&x.getMonth()===new Date().getMonth()&&x.getFullYear()===new Date().getFullYear()});d.classList.toggle('has-appointment',has)})}
    function openModal(){
        const b=document.createElement('div');b.className='cs-modal-backdrop';b.innerHTML=`<div class="cs-modal"><button class="cs-close">×</button><h2>Schedule Appointment</h2><p class="muted">Create a real appointment in MongoDB.</p><form id="appointmentCreateForm"><div class="cs-form-grid"><div class="cs-field"><label>Patient *</label><select name="patient" required><option value="">Select patient</option>${patients.map(p=>`<option value="${p._id}">${esc(p.firstName)} ${esc(p.lastName)} — ${esc(p.patientId)}</option>`).join('')}</select></div><div class="cs-field"><label>Doctor *</label><select name="doctor" required><option value="">Select doctor</option>${doctors.map(d=>`<option value="${d._id}">${esc(d.fullName)} — ${esc(d.department)}</option>`).join('')}</select></div><div class="cs-field"><label>Department *</label><select name="department" required><option>Cardiology</option><option>Neurology</option><option>Orthopedics</option><option>Pediatrics</option><option>Emergency</option><option>General Medicine</option></select></div><div class="cs-field"><label>Type</label><select name="appointmentType"><option>Consultation</option><option>Follow-up</option><option>Emergency</option><option>Routine Checkup</option><option>Surgery</option></select></div><div class="cs-field"><label>Date *</label><input type="date" name="appointmentDate" required min="${new Date().toISOString().slice(0,10)}"></div><div class="cs-field"><label>Time *</label><input type="time" name="appointmentTime" required></div><div class="cs-field"><label>Consultation Fee</label><input type="number" name="consultationFee" min="0" value="500"></div><div class="cs-field"><label>Symptoms</label><input name="symptoms" placeholder="Optional"></div></div><div class="cs-modal-actions"><button type="button" class="cs-btn secondary" id="cancelModal">Cancel</button><button class="cs-btn primary">Schedule Appointment</button></div></form></div>`;
        document.body.appendChild(b); const close=()=>b.remove();b.querySelector('.cs-close').addEventListener('click', close);b.querySelector('#cancelModal').addEventListener('click', close);b.addEventListener('click', e=>{if(e.target===b)close()});
        b.querySelector('form').addEventListener('submit', async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const doctor=doctors.find(x=>x._id===d.doctor);try{await apiRequest('/appointments',{method:'POST',body:JSON.stringify({...d,appointmentId:`APT${Date.now().toString().slice(-7)}`,appointmentDate:new Date(`${d.appointmentDate}T00:00:00`).toISOString(),consultationFee:Number(d.consultationFee||0)})});close();showToast('Appointment scheduled');load();}catch(err){showToast(err.message,'error')}});
    }
    if (newBtn) newBtn.addEventListener('click', openModal);
    document.addEventListener('click', e => {
        const btn = e.target.closest('.hero-right button');
        if (btn && /new appointment/i.test(btn.textContent) && btn !== newBtn) openModal();
    });
    search?.addEventListener('input',render);
    load();
});
