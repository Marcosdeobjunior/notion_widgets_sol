// Inicialização de dados
let skills = JSON.parse(localStorage.getItem('skills')) || [
  { name: 'Força', value: 6 },
  { name: 'Agilidade', value: 8 },
  { name: 'Magia', value: 10 },
];

let ctx;
let chart;

// Função para obter a cor baseada na raridade
function getRarityColor(level) {
  if (level <= 2) return '#777';        // F
  if (level <= 4) return '#9c27b0';     // D
  if (level <= 6) return '#2196f3';     // C
  if (level === 7) return '#4caf50';    // B
  if (level === 8) return '#ffeb3b';    // A
  if (level === 9) return '#ff9800';    // S
  return '#f44336';                     // EX
}

// Função para obter a classe de raridade
function getRarityClass(level) {
  if (level <= 2) return 'F';
  if (level <= 4) return 'D';
  if (level <= 6) return 'C';
  if (level === 7) return 'B';
  if (level === 8) return 'A';
  if (level === 9) return 'S';
  return 'EX';
}

// Inicialização do gráfico
function initChart() {
  ctx = document.getElementById('skillChart').getContext('2d');
  
  chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: skills.map(s => s.name),
      datasets: [{
        label: 'Nível',
        data: skills.map(s => s.value),
        backgroundColor: 'rgba(0, 188, 212, 0.2)',
        borderColor: '#00bcd4',
        pointBackgroundColor: skills.map(s => getRarityColor(s.value)),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: skills.map(s => getRarityColor(s.value)),
        pointRadius: skills.map(s => s.value >= 9 ? 8 : 5),
        pointHoverRadius: 10,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
      },
      scales: {
        r: {
          angleLines: { color: '#444' },
          grid: { color: '#333' },
          pointLabels: {
            color: '#f0f0f0',
            font: { size: 14 }
          },
          ticks: {
            color: '#ccc',
            beginAtZero: true,
            max: 10,
            stepSize: 1,
            backdropColor: 'transparent'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const rarity = getRarityClass(value);
              return `Nível: ${value} (${rarity})`;
            }
          }
        }
      }
    }
  });
  
  // Adicionar efeitos visuais avançados ao gráfico
  addChartEffects();
}

// Funções para manipulação de dados
function saveSkills() {
  localStorage.setItem('skills', JSON.stringify(skills));
}

function updateChart() {
  chart.data.labels = skills.map(s => s.name);
  chart.data.datasets[0].data = skills.map(s => s.value);
  chart.data.datasets[0].pointBackgroundColor = skills.map(s => getRarityColor(s.value));
  chart.data.datasets[0].pointHoverBorderColor = skills.map(s => getRarityColor(s.value));
  chart.data.datasets[0].pointRadius = skills.map(s => s.value >= 9 ? 8 : 5);
  chart.update();
  renderSkillList();
  saveSkills();
  
  // Atualizar efeitos visuais
  updateChartEffects();
}

function addSkill() {
  const name = document.getElementById('skillName').value.trim();
  const value = parseInt(document.getElementById('skillValue').value);
  if (name && !isNaN(value) && value >= 0 && value <= 10) {
    skills.push({ name, value });
    updateChart();
    document.getElementById('skillName').value = '';
    document.getElementById('skillValue').value = '';
    
    // Adicionar efeito de partícula para nova habilidade
    createParticleEffect();
  }
}

function renderSkillList() {
  const container = document.getElementById('skillList');
  container.innerHTML = '';
  skills.forEach((skill, index) => {
    const div = document.createElement('div');
    div.className = 'skill-item';
    
    // Adiciona classe de raridade para estilização
    const rarityClass = getRarityClass(skill.value);
    div.classList.add(`rarity-${rarityClass}`);
    
    // Adiciona classes baseadas no nível para efeitos visuais
    if (skill.value === 7) div.classList.add('skill-level-high');
    if (skill.value === 8) div.classList.add('skill-level-very-high');
    if (skill.value === 9) div.classList.add('skill-level-extreme');
    if (skill.value === 10) {
      div.classList.add('skill-level-max');
      div.classList.add('fire-effect');
    }
    
    div.innerHTML = `
      <span class="rarity-indicator rarity-${rarityClass}">${rarityClass}</span>
      <input type="text" value="${skill.name}" onchange="editSkillName(${index}, this.value)">
      <input type="number" min="0" max="10" value="${skill.value}" onchange="editSkillValue(${index}, this.value)">
      <button class="remove-btn" onclick="removeSkill(${index})">X</button>
    `;
    container.appendChild(div);
  });
}

function removeSkill(index) {
  skills.splice(index, 1);
  updateChart();
}

function editSkillName(index, newName) {
  skills[index].name = newName;
  updateChart();
}

function editSkillValue(index, newValue) {
  const value = parseInt(newValue);
  if (!isNaN(value) && value >= 0 && value <= 10) {
    const oldValue = skills[index].value;
    skills[index].value = value;
    updateChart();
    
    // Adicionar efeito visual se o valor aumentou para um nível alto
    if (value > oldValue && value >= 7) {
      createParticleEffect();
    }
  }
}

// Funções para manipulação de imagem
function loadImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const image = document.getElementById('charImage');
      image.src = e.target.result;
      image.style.display = 'block';
      localStorage.setItem('charImage', e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

function triggerImageUpload() {
  document.getElementById('imageInput').click();
}

// Funções para manipulação de informações do personagem
function saveInfo() {
  const infoTextarea = document.getElementById('charInfo');
  localStorage.setItem('charInfo', infoTextarea.value);
}

function loadInfo() {
  const saved = localStorage.getItem('charInfo');
  const infoTextarea = document.getElementById('charInfo');
  if (saved) infoTextarea.value = saved;
}

function loadImageFromStorage() {
  const savedImage = localStorage.getItem('charImage');
  if (savedImage) {
    const image = document.getElementById('charImage');
    image.src = savedImage;
    image.style.display = 'block';
  }
}

// Efeitos visuais avançados
function addChartEffects() {
  // Registrar plugin para efeitos visuais no gráfico
  Chart.plugins.register({
    afterDatasetsDraw: function(chart) {
      const ctx = chart.ctx;
      
      chart.data.datasets.forEach(function(dataset, i) {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          meta.data.forEach(function(element, index) {
            const value = dataset.data[index];
            
            // Adiciona efeitos baseados no nível
            if (value >= 7) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(element._model.x, element._model.y, value >= 10 ? 15 : 10, 0, 2 * Math.PI);
              ctx.shadowColor = getRarityColor(value);
              ctx.shadowBlur = value * 2;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
              ctx.fill();
              ctx.restore();
              
              // Adiciona efeitos especiais para níveis altos
              if (value >= 9) {
                // Círculos concêntricos para níveis 9-10
                ctx.save();
                ctx.beginPath();
                ctx.arc(element._model.x, element._model.y, value >= 10 ? 20 : 15, 0, 2 * Math.PI);
                ctx.strokeStyle = getRarityColor(value);
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.5;
                ctx.stroke();
                ctx.restore();
              }
              
              // Adiciona emoji de fogo para nível 10
              if (value === 10) {
                ctx.save();
                ctx.font = '20px Arial';
                ctx.fillText('🔥', element._model.x + 10, element._model.y - 10);
                ctx.restore();
                
                // Adiciona linhas de energia para nível 10
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(element._model.x, element._model.y);
                ctx.lineTo(chart.chartArea.width / 2, chart.chartArea.height / 2);
                ctx.strokeStyle = getRarityColor(value);
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.3;
                ctx.stroke();
                ctx.restore();
              }
            }
          });
        }
      });
    }
  });
}

function updateChartEffects() {
  // Atualizar classes CSS no canvas do gráfico baseado nos níveis
  const canvas = document.getElementById('skillChart');
  canvas.classList.remove('chart-glow');
  
  // Adicionar efeito de brilho se houver habilidades de alto nível
  if (skills.some(s => s.value >= 8)) {
    canvas.classList.add('chart-glow');
  }
  
  // Adicionar efeitos específicos para cada nível
  skills.forEach((skill, index) => {
    if (skill.value >= 7) {
      canvas.classList.add(`radar-effect-${skill.value}`);
    }
  });
}

// Efeitos de partículas
function createParticleEffect() {
  const container = document.querySelector('.particles-container');
  if (!container) return;
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posição aleatória
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Tamanho aleatório
    const size = Math.random() * 5 + 2;
    
    // Cor baseada em raridade alta
    const colors = ['#4caf50', '#ffeb3b', '#ff9800', '#f44336'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size}px ${color}`;
    
    container.appendChild(particle);
    
    // Animação
    const duration = Math.random() * 2000 + 1000;
    const keyframes = [
      { transform: `translate(0, 0) scale(1)`, opacity: 1 },
      { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0)`, opacity: 0 }
    ];
    
    particle.animate(keyframes, {
      duration: duration,
      easing: 'ease-out',
      fill: 'forwards'
    });
    
    // Remover partícula após a animação
    setTimeout(() => {
      particle.remove();
    }, duration);
  }
}

// Exportar/Importar dados
function exportData() {
  const data = {
    skills: skills,
    charInfo: document.getElementById('charInfo').value,
    charImage: localStorage.getItem('charImage')
  };
  
  const dataStr = JSON.stringify(data);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportLink = document.createElement('a');
  exportLink.setAttribute('href', dataUri);
  exportLink.setAttribute('download', 'skill-radar-data.json');
  exportLink.click();
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
      try {
        const data = JSON.parse(event.target.result);
        
        if (data.skills) {
          skills = data.skills;
          saveSkills();
        }
        
        if (data.charInfo) {
          document.getElementById('charInfo').value = data.charInfo;
          localStorage.setItem('charInfo', data.charInfo);
        }
        
        if (data.charImage) {
          const image = document.getElementById('charImage');
          image.src = data.charImage;
          image.style.display = 'block';
          localStorage.setItem('charImage', data.charImage);
        }
        
        updateChart();
        createParticleEffect();
        
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        alert('Erro ao importar dados. Verifique se o arquivo é válido.');
      }
    };
    
    reader.readAsText(file);
  };
  
  input.click();
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  initChart();
  renderSkillList();
  loadInfo();
  loadImageFromStorage();
  
  // Adicionar container de partículas se não existir
  if (!document.querySelector('.particles-container')) {
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.querySelector('.chart-container').appendChild(container);
  }
  
  // Adicionar evento de clique na imagem para edição
  const charImage = document.getElementById('charImage');
  if (charImage) {
    charImage.addEventListener('click', triggerImageUpload);
  }
  
  // Criar efeito inicial de partículas
  setTimeout(createParticleEffect, 500);
});
