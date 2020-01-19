window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://v2-api.sheety.co/714c95b289e9a3b690cd2fc10966e008/workoutDays/dates').then((
        response) => {
        return response.json();
    }).then((myJson) => {
        let arDays = myJson.dates;
        let daysCount = [];
        let datesCount = [];
        let datesStamped = [];
        for (let i = 0; i < arDays.length; i++) {
            let item = arDays[i];
            let jsDate = item.date;
            let arDate = item.date.split("/");
            let month = arDate[0];
            arDate[0] = arDate[1];
            arDate[1] = month;
            item.date = arDate.join(".");
            if (!datesCount.includes(item.date)) {
                if (item.day == "Monday") {
                    item.day = "Понедельник"
                } else if (item.day == "Tuesday") {
                    item.day = "Вторник"
                } else if (item.day == "Wednesday") {
                    item.day = "Среда"
                } else if (item.day == "Thursday") {
                    item.day = "Четверг"
                } else if (item.day == "Friday") {
                    item.day = "Пятница"
                } else if (item.day == "Saturday") {
                    item.day = "Суббота"
                } else if (item.day == "Sunday") {
                    item.day = "Воскресенье"
                }
                daysCount.push(item.day);
                datesCount.push(item.date);
                let d = new Date(jsDate);
                let s = d.getTime().toString();
                s = s.slice(0, 10);
                datesStamped.push(s);
                let li = document.createElement("li");
                li.innerHTML = `${item.day} ${item.date}`;
                let theFirstChild = document.querySelector("#days").firstChild;
                document.querySelector("#days").insertBefore(li, theFirstChild);
            }
        };
        const daysCounted = daysCount.reduce(function (acc, el) {
            acc[el] = (acc[el] || 0) + 1;
            return acc;
        }, {});
        let chart = new frappe.Chart("#frostChart", {
            data: {
                labels: Object.keys(daysCounted),
                datasets: [{
                    values: Object.values(daysCounted)
                }]
            },
            title: "Самые популярные дни",
            type: 'bar',
            height: 140,
            colors: ['red', 'blue', 'green']
        });
        let startDate = new Date(datesCount[0]);
        let endDate = new Date(datesCount[datesCount.length - 1]);
        datesStamped = datesStamped.reduce((a, b) => (a[b] = 1, a), {});
        let heatmap = new frappe.Chart("#heatmap", {
            type: 'heatmap',
            title: "Посещения",
            data: {
                dataPoints: datesStamped,
                start: startDate,
                end: endDate
            },
            countLabel: 'День',
            discreteDomains: 1,
            colors: ['#ebedf0', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e'],
        });
    });
});