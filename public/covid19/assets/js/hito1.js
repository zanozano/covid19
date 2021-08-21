window.onload = function () {

    const cargaGrafico = (data) => {

        let masCasos = data.filter(pais => {
            return pais.deaths > 100000
        })

        let activos = new Array;

        masCasos.forEach(element => {
            activos.push({
                "label": element.location,
                "y": element.active
            })
        });

        let confirmados = new Array;

        masCasos.forEach(element => {
            confirmados.push({
                "label": element.location,
                "y": element.confirmed
            })
        });

        let fallecidos = new Array;

        masCasos.forEach(element => {
            fallecidos.push({
                "label": element.location,
                "y": element.deaths
            })
        });

        let recuperados = new Array;

        masCasos.forEach(element => {
            recuperados.push({
                "label": element.location,
                "y": element.recovered
            })
        });

        var chart = new CanvasJS.Chart("allCountryGraph", {
            animationEnabled: true,
            title: {
                text: "Paises con COVID-19."
            },
            axisY: {
                title: "Casos de covid.",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: [{
                    type: "column",
                    name: "Casos activos",
                    legendText: "Casos activos",
                    color: "red",
                    showInLegend: true,
                    dataPoints: activos
                },
                {
                    type: "column",
                    name: "Casos confirmados",
                    legendText: "Casos confirmados",
                    color: "gold",
                    showInLegend: true,
                    dataPoints: confirmados
                },
                {
                    type: "column",
                    name: "Casos muertos",
                    legendText: "Casos muertos",
                    color: "silver",
                    showInLegend: true,
                    dataPoints: fallecidos
                },
                {
                    type: "column",
                    name: "Casos recuperados",
                    legendText: "Casos recuperados",
                    color: "green",
                    showInLegend: true,
                    dataPoints: recuperados
                }
            ]
        });
        chart.render();

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            chart.render();
        }
    }
    window.verDetalle = (pais) => {
        fetch(`http://localhost:3000/api/countries/${pais}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let {
                    location,
                    confirmed,
                    deaths,
                    recovered,
                    active
                } = data.data;

                if (data.data.hasOwnProperty("location")) {


                    document.getElementById("exampleModalLabel").textContent = `Situación actual de ${location} por casos de COVID-19.`

                    var chart = new CanvasJS.Chart("countryGraph", {
                        animationEnabled: true,
                        theme: "light2", // "light1", "light2", "dark1", "dark2"
                        /* axisY: {
                            title: "Cantidad de casos de COVID-19."
                        }, */
                        data: [{
                            type: "column",
                            showInLegend: true,
                            legendMarkerColor: "grey",
                            legendText: "Cantidad de casos segmentados.",
                            dataPoints: [{
                                    y: confirmed,
                                    label: "Confirmados"
                                },
                                {
                                    y: deaths,
                                    label: "Fallecidos"
                                },
                                {
                                    y: recovered,
                                    label: "Recuperados"
                                },
                                {
                                    y: active,
                                    label: "Activos"
                                }
                            ]
                        }]
                    });
                    chart.render();

                } else {
                    document.getElementById("countryGraph").innerHTML = "<h2>Información no encontrada.</h2>";
                }

            })
            .catch(function (error) {
                console.log('Hubo un problema con la petición Fetch:' + error.message);
            });
    }

    const cargarTable = (data) => {
        let text = "";
        let count = 1;
        data.forEach(pais => {
            text += `
                <tr>
                <th scope="row">${count}</th>
                <td>${pais.location}</td>
                <td>${pais.confirmed}</td>
                <td>${pais.deaths}</td>
                <td>${pais.recovered}</td>
                <td>${pais.active}</td>
                <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#countryModal" onclick="verDetalle('${pais.location}')">Ver detalle</button></td>
                </tr>`
            count++
        });
        document.getElementById("bodyTable").innerHTML = text;
    }

    fetch('http://localhost:3000/api/total')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            cargaGrafico(data.data);
            cargarTable(data.data)
        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
}