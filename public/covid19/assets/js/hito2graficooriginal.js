window.onload = function () {
    const token = localStorage.getItem('jwt-token')

    const getDatos = async (jwt, option) => {
        try {
            let url = "http://localhost:3000/api/";

            if (option == 1) {
                url += "confirmed"
            } else if (option == 2) {
                url += "deaths"
            } else if (option == 3) {
                url += "recovered"
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            let {
                data
            } = await response.json()
            if (data) {

                data = data.map(function (obj) {
                    var rObj = {};
                    let array = obj.date.split("/");
                    let fecha = new Date(array[2], array[0], array[1])

                    rObj.x = fecha
                    rObj.y = obj.total;
                    return rObj;
                });

                return data;
            }
        } catch (err) {
            console.error(`Error: ${err}`)
        }
    }

    (async function () {

        Promise.all([getDatos(token, 1), getDatos(token, 2), getDatos(token, 3)]).then(function (values) {
            pintar(values[0].slice(values[0].length - 50), values[1].slice(values[1].length - 50), values[2].slice(values[2].length - 50))
        });




    })();


    function pintar(confirmed, deaths, recovered) {
        var chart = new CanvasJS.Chart("chartCovidChile", {
            title: {
                text: "Situación de COVID-19 en Chile."
            },
            axisX: {
                valueFormatString: "MMM YYYY"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                horizontalAlign: "center",
                dockInsidePlotArea: true,
                itemclick: toogleDataSeries
            },
            data: [{
                    type: "line",
                    axisYType: "primary",
                    name: "Confirmados",
                    showInLegend: true,
                    markerSize: 0,
                    yValueFormatString: "#,###",
                    dataPoints: confirmed
                },
                {
                    type: "line",
                    axisYType: "primary",
                    name: "Fallecidos",
                    showInLegend: true,
                    markerSize: 0,
                    yValueFormatString: "#,###",
                    dataPoints: deaths
                },
                {
                    type: "line",
                    axisYType: "primary",
                    name: "Recuperados",
                    showInLegend: true,
                    markerSize: 0,
                    yValueFormatString: "#,###",
                    dataPoints: recovered
                }
            ]
        });
        chart.render();

        function toogleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            chart.render();
        }
    }


}