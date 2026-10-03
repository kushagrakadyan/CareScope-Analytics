document.addEventListener("DOMContentLoaded", async () => {
    const cards = [...document.querySelectorAll('.cards .card')];
    const setCard = (i, value) => {
        const h = cards[i]?.querySelector('h2');
        if (h) h.textContent = value;
    };

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
            '/analytics/recent'
        ];
        const responses = await Promise.all(endpoints.map(async url => {
            try { return await apiRequest(url); }
            catch (e) { return { success: false, error: e.message }; }
        }));

        const [dash, gender, blood, status, monthly, recent] = responses;
        const a = dash.analytics || {};
        setCard(0, a.totalPatients ?? 0);
        setCard(1, `${a.completionRate ?? 0}%`);
        setCard(2, a.totalAppointments ?? 0);
        setCard(3, a.criticalPatients ?? 0);

        const g = gender.analytics || [];
        const b = blood.analytics || [];
        const st = status.analytics || [];
        const m = monthly.analytics || [];
        draw('predictionChart', 'line', m.map(x => x._id?.month || x.month || x._id || ''), m.map(x => x.totalAppointments || x.count || 0), 'Appointments');
        draw('genderChart', 'doughnut', g.map(x => x._id || 'Unknown'), g.map(x => x.totalPatients || x.count || 0), 'Patients');
        draw('bloodChart', 'bar', b.map(x => x._id || 'Unknown'), b.map(x => x.totalPatients || x.count || 0), 'Patients');
        draw('statusChart', 'doughnut', st.map(x => x._id || 'Unknown'), st.map(x => x.totalAppointments || x.count || 0), 'Appointments');

        const activity = document.querySelector('.activity-list');
        if (activity) {
            const arr = recent.activities || recent.recentActivities || [];
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
