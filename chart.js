const LABEL_NAMES = ['Hp', 'Attack','Defense', 'Sp. Attack', 'Sp. Def','Speed'];
const CHART_BG_COLOR = ['rgb(41 227 96)','rgb(251 22 22)','rgb(11 134 255)','rgb(241 131 0)','rgb(134 64 251)','rgb(243 255 18)'];




function renderChart(pokemon) {
  const ctx = document.getElementById('myChart');
  
  let stats = [
      pokemon['stats'][0]['base_stat'],
      pokemon['stats'][1]['base_stat'],
      pokemon['stats'][2]['base_stat'],
      pokemon['stats'][3]['base_stat'],
      pokemon['stats'][4]['base_stat'],
      pokemon['stats'][5]['base_stat']
  ];
  
  let chartOptions = {
      type: 'bar',
      data: {
          labels: LABEL_NAMES,
          datasets: [{
              label: 'Stats',
              data: stats,
              backgroundColor: CHART_BG_COLOR,
              borderWidth: 1,
              borderRadius: 15,
              barPercentage: 0.75,
              categoryPercentage: 1
          }]
      },
      options: {
          indexAxis: 'y',
          plugins: {
              legend: {
                  display: false
              },
              datalabels: {
                  display: function(context) {
                      return context.chart.width > 380; // Nur anzeigen, wenn die Breite des Charts größer als 380px ist
                  }
              }
          }
      }
  };

  // Erstellen Sie das Chart-Objekt mit den oben definierten Optionen
  new Chart(ctx, chartOptions);
}
