document.addEventListener("DOMContentLoaded", async () => {
    const cards = [...document.querySelectorAll('.cards .card')];
    const setCard = (i, value) => {
        const h = cards[i]?.querySelector('h2');
        if (h) h.textContent = value;
    };

    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chartInstances = {};
    const destroy = id => {
        if (chartInstances[id]) {
            chartInstances[id].destroy();
            delete chartInstances[id];
        }
        const canvas = document.getElementById(id);
        if (canvas && typeof Chart !== 'undefined') {
            const existing = Chart.getChart(canvas);
            if (existing) existing.destroy();
        }
    };

    const draw = (id, type, labels, data, label) => {
        const canvas = document.getElementById(id);
        if (!canvas || typeof Chart === 'undefined') return;
        destroy(id);
        chartInstances[id] = new Chart(canvas, {
            type,
            data: {
                labels: labels.length ? labels : ['No data'],
                datasets: [{
                    label,
                    data: data.length ? data : [0],
                    borderColor: '#2563eb',
                    backgroundColor: type === 'line' ? 'rgba(37,99,235,.16)' : ['#2563eb','#14b8a6','#f59e0b','#ef4444','#8b5cf6','#0ea5e9'],
                    fill: type === 'line',
                    tension: .35,
                    borderWidth: 2
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
    };

    try {
        const endpoints = [
            '/analytics/dashboard',
            '/analytics/gender',
            '/analytics/blood-groups',
            '/analytics/appointment-status',
            '/analytics/monthly-appointments',
            '/analytics/recent',
            '/analytics/patient-departments',
            '/analytics/monthly-reports'
        ];
        const responses = await Promise.all(endpoints.map(async url => {
            try { return await apiRequest(url); }
            catch (e) { return { success: false, error: e.message }; }
        }));

        const [dash, gender, blood, status, monthly, recent, depts, monthlyReports] = responses;
        const a = dash.analytics || {};
        setCard(0, a.totalPatients ?? 0);
        setCard(1, `${a.completionRate ?? 0}%`);
        setCard(2, a.totalAppointments ?? 0);
        setCard(3, a.criticalPatients ?? 0);

        const g = gender.analytics || [];
        const b = blood.analytics || [];
        const st = status.statistics || status.analytics || [];
        const m = monthly.analytics || [];
        draw('predictionChart', 'line', m.map(x => x._id && typeof x._id === 'object' ? `${MONTHS[(x._id.month || 1) - 1]} ${x._id.year}` : (x._id || '')), m.map(x => x.totalAppointments || x.count || 0), 'Appointments');
        draw('genderChart', 'doughnut', g.map(x => x._id || 'Unknown'), g.map(x => x.totalPatients || x.count || 0), 'Patients');
        draw('bloodChart', 'bar', b.map(x => x._id || 'Unknown'), b.map(x => x.totalPatients || x.count || 0), 'Patients');
        draw('statusChart', 'doughnut', st.map(x => x._id || 'Unknown'), st.map(x => x.total ?? x.totalAppointments ?? x.count ?? 0), 'Appointments');

        const d = depts.statistics || [];
        draw('analyticsDepartmentChart', 'bar', d.map(x => x._id || 'Unknown'), d.map(x => x.totalPatients || 0), 'Patients');
        draw('hospitalUtilizationChart', 'bar', d.map(x => x._id || 'Unknown'), d.map(x => x.totalPatients || 0), 'Patients');
        const mr = monthlyReports.analytics || [];
        const mrLabels = mr.map(x => x._id ? `${MONTHS[(x._id.month || 1) - 1]} ${x._id.year}` : '');
        draw('analyticsRecoveryChart', 'line', mrLabels, mr.map(x => x.totalReports || 0), 'Reports');
        draw('diseaseTrendChart', 'line', mrLabels, mr.map(x => x.totalReports || 0), 'Reports');

        const activity = document.querySelector('.activity-list');
        if (activity) {
            const arr = [
                ...(recent.recentPatients || []).map(x => ({ title: 'New patient', description: `${x.firstName || ''} ${x.lastName || ''} registered`, createdAt: x.createdAt })),
                ...(recent.recentAppointments || []).map(x => ({ title: 'Appointment ' + (x.status || ''), description: `${x.patient?.firstName || 'Patient'} ${x.patient?.lastName || ''} with ${x.doctor?.fullName || 'doctor'}`, createdAt: x.createdAt })),
                ...(recent.recentReports || []).map(x => ({ title: 'Report ' + (x.reportStatus || ''), description: x.reportTitle || 'Medical report', createdAt: x.createdAt }))
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            activity.innerHTML = arr.length
                ? arr.slice(0, 8).map(x => `<div class="activity-item"><div class="activity-dot blue"></div><div><h4>${x.title || x.action || 'Activity'}</h4><p>${x.description || x.message || new Date(x.createdAt || Date.now()).toLocaleString()}</p></div></div>`).join('')
                : '<div class="cs-empty">No recent activity yet.</div>';
        }

        const insightButton = document.querySelector('.hero-right button');
        insightButton?.addEventListener('click', () => location.reload());
    } catch (error) {
        showToast(error.message || 'Unable to load analytics.', 'error');
    }
});
