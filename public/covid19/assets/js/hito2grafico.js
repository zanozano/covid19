//GRAFICO COVID CHILE
window.onload = function () {
    if (localStorage.getItem("jwt-token")) {
        let pintar = (confirmed, deaths, recovered) => {
            function toogleDataSeries(e) {
                if (
                    typeof e.dataSeries.visible === "undefined" ||
                    e.dataSeries.visible
                ) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                //FUNCION TOGGLE QUE RENDERIZA GRAFICO DE CHILE EN HTML 
                chart.render();
            }
            var chart = new CanvasJS.Chart("chartCovidChile", {
                animationEnabled: true,
                exportEnabled: true,
                title: {
                    text: "Casos de COVID-19 en Chile",
                },
                toolTip: {
                    shared: true,
                },
                legend: {
                    cursor: "pointer",
                    itemclick: toogleDataSeries,
                },
                data: [{
                        type: "spline",
                        name: "Confirmados",
                        showInLegend: true,
                        dataPoints: confirmed,
                    },
                    {
                        type: "spline",
                        name: "Fallecidos",
                        showInLegend: true,
                        dataPoints: deaths,
                    },
                    {
                        type: "spline",
                        name: "Recuperados",
                        showInLegend: true,
                        dataPoints: recovered,
                    },
                ],
            });
            //FUNCION QUE RENDERIZA GRAFICO POR PAIS EN HTML
            chart.render();
        };
        //TOKEN ALMACENADO EN EL LOCAL STORAGE
        const token = localStorage.getItem("jwt-token");
        if (
            localStorage.getItem("confirmados") &&
            localStorage.getItem("fallecidos") &&
            localStorage.getItem("recuperados")
        ) {
            let confirmados = JSON.parse(localStorage.getItem("confirmados"));
            let fallecidos = JSON.parse(localStorage.getItem("fallecidos"));
            let recuperados = JSON.parse(localStorage.getItem("recuperados"));

            pintar(confirmados, fallecidos, recuperados);
        } else {
            const getDatos = async (jwt, option) => {
                try {
                    let url = "http://localhost:3000/api/";

                    if (option == 1) {
                        url += "confirmed";
                    } else if (option == 2) {
                        url += "deaths";
                    } else if (option == 3) {
                        url += "recovered";
                    }
                    //GET URL
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    });
                    let {
                        data
                    } = await response.json();
                    if (data) {
                        data = data.map((obj) => {
                            var rObj = {};
                            rObj.label = obj.date;
                            rObj.y = obj.total;
                            return rObj;
                        });

                        return data;
                    }
                } catch (err) {
                    console.error(`Error: ${err}`);
                }
            };
            //FUNCION AUTO EJECUTABLE QUE ACCIONA 3 PETICIONES A TRAVES DE UN PROMISE ALL, ESPERANDO LAS 3 PARA EJECUTAR EL THEN
            (async function () {
                Promise.all([
                    getDatos(token, 1),
                    getDatos(token, 2),
                    getDatos(token, 3),
                ]).then(function (values) {
                    localStorage.setItem("confirmados", JSON.stringify(values[0]));
                    localStorage.setItem("fallecidos", JSON.stringify(values[1]));
                    localStorage.setItem("recuperados", JSON.stringify(values[2]));
                    pintar(values[0], values[1], values[2]);
                });
            })();
        }
    } else {
        window.location.href = "./index.html";
    }
};