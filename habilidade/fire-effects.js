// Função para criar efeitos de fogo para habilidades de nível 10
function createFireEffect(chart) {
  const ctx = chart.ctx;
  const chartArea = chart.chartArea;
  
  chart.data.datasets.forEach(function(dataset, i) {
    const meta = chart.getDatasetMeta(i);
    if (!meta.hidden) {
      meta.data.forEach(function(element, index) {
        const value = dataset.data[index];
        
        // Adiciona efeito de fogo para nível 10
        if (value === 10) {
          // Desenha o efeito de brilho ao redor do ponto
          ctx.save();
          
          // Gradiente radial para simular fogo
          const gradient = ctx.createRadialGradient(
            element._model.x, element._model.y, 5,
            element._model.x, element._model.y, 30
          );
          
          gradient.addColorStop(0, 'rgba(255, 255, 0, 0.9)');
          gradient.addColorStop(0.3, 'rgba(255, 165, 0, 0.7)');
          gradient.addColorStop(0.6, 'rgba(255, 0, 0, 0.5)');
          gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
          
          ctx.beginPath();
          ctx.arc(element._model.x, element._model.y, 30, 0, 2 * Math.PI);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Desenha linhas de "fogo" saindo do ponto
          const numLines = 8;
          const maxLength = 40;
          
          for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * 2 * Math.PI;
            const length = 20 + Math.random() * 20; // Comprimento variável
            
            const endX = element._model.x + Math.cos(angle) * length;
            const endY = element._model.y + Math.sin(angle) * length;
            
            // Gradiente linear para as linhas
            const lineGradient = ctx.createLinearGradient(
              element._model.x, element._model.y,
              endX, endY
            );
            
            lineGradient.addColorStop(0, 'rgba(255, 255, 0, 0.9)');
            lineGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.7)');
            lineGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.moveTo(element._model.x, element._model.y);
            ctx.lineTo(endX, endY);
            ctx.lineWidth = 3;
            ctx.strokeStyle = lineGradient;
            ctx.stroke();
          }
          
          // Adiciona partículas de fogo
          for (let i = 0; i < 5; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const distance = 10 + Math.random() * 20;
            
            const particleX = element._model.x + Math.cos(angle) * distance;
            const particleY = element._model.y + Math.sin(angle) * distance;
            const size = 2 + Math.random() * 3;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, size, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, ${Math.floor(165 + Math.random() * 90)}, 0, ${0.7 + Math.random() * 0.3})`;
            ctx.fill();
          }
          
          // Adiciona emoji de fogo com efeito de brilho
          ctx.font = '24px Arial';
          ctx.fillText('🔥', element._model.x + 15, element._model.y - 15);
          
          ctx.restore();
          
          // Desenha uma linha brilhante até o centro
          ctx.save();
          const centerX = chartArea.left + chartArea.width / 2;
          const centerY = chartArea.top + chartArea.height / 2;
          
          const lineGradient = ctx.createLinearGradient(
            element._model.x, element._model.y,
            centerX, centerY
          );
          
          lineGradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
          lineGradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.4)');
          lineGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
          
          ctx.beginPath();
          ctx.moveTo(element._model.x, element._model.y);
          ctx.lineTo(centerX, centerY);
          ctx.lineWidth = 2;
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
          ctx.restore();
        }
        // Efeitos para níveis 8-9
        else if (value >= 8) {
          ctx.save();
          
          // Brilho mais suave para níveis altos, mas não máximos
          const glowColor = value === 9 ? 'rgba(255, 152, 0, 0.6)' : 'rgba(255, 235, 59, 0.5)';
          const glowSize = value === 9 ? 20 : 15;
          
          const gradient = ctx.createRadialGradient(
            element._model.x, element._model.y, 5,
            element._model.x, element._model.y, glowSize
          );
          
          gradient.addColorStop(0, glowColor);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.beginPath();
          ctx.arc(element._model.x, element._model.y, glowSize, 0, 2 * Math.PI);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.restore();
        }
      });
    }
  });
}

// Atualiza a função addChartEffects para incluir os novos efeitos de fogo
function addChartEffects() {
  // Registrar plugin para efeitos visuais no gráfico
  Chart.plugins.register({
    afterDatasetsDraw: function(chart) {
      const ctx = chart.ctx;
      
      // Adiciona efeitos de fogo para nível 10
      createFireEffect(chart);
      
      chart.data.datasets.forEach(function(dataset, i) {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          meta.data.forEach(function(element, index) {
            const value = dataset.data[index];
            
            // Adiciona efeitos baseados no nível
            if (value >= 7 && value < 10) {  // Efeitos para níveis 7-9
              ctx.save();
              ctx.beginPath();
              ctx.arc(element._model.x, element._model.y, value >= 9 ? 15 : 10, 0, 2 * Math.PI);
              ctx.shadowColor = getRarityColor(value);
              ctx.shadowBlur = value * 2;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
              ctx.fill();
              ctx.restore();
              
              // Adiciona efeitos especiais para níveis altos
              if (value >= 9) {
                // Círculos concêntricos para nível 9
                ctx.save();
                ctx.beginPath();
                ctx.arc(element._model.x, element._model.y, 20, 0, 2 * Math.PI);
                ctx.strokeStyle = getRarityColor(value);
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.5;
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

// Atualiza a função updateChartEffects para aplicar classes CSS de fogo
function updateChartEffects() {
  // Atualizar classes CSS no canvas do gráfico baseado nos níveis
  const canvas = document.getElementById('skillChart');
  canvas.classList.remove('chart-glow', 'fire-effect-canvas', 'chart-fire-effect');
  
  // Adicionar efeito de brilho se houver habilidades de alto nível
  if (skills.some(s => s.value >= 8)) {
    canvas.classList.add('chart-glow');
  }
  
  // Adicionar efeito de fogo se houver habilidades de nível 10
  if (skills.some(s => s.value === 10)) {
    canvas.classList.add('fire-effect-canvas');
    canvas.classList.add('chart-fire-effect');
    
    // Adiciona título com efeito de fogo
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer && !document.querySelector('.chart-title')) {
      const title = document.createElement('div');
      title.className = 'chart-title';
      title.textContent = 'RADAR DE HABILIDADES';
      chartContainer.prepend(title);
    }
  }
  
  // Adicionar efeitos específicos para cada nível
  skills.forEach((skill, index) => {
    if (skill.value >= 7) {
      canvas.classList.add(`radar-effect-${skill.value}`);
    }
  });
}

// Função melhorada para criar efeitos de partículas de fogo
function createFireParticleEffect() {
  const container = document.querySelector('.particles-container');
  if (!container) return;
  
  // Verifica se há habilidades de nível 10
  const hasMaxLevel = skills.some(s => s.value === 10);
  
  // Número de partículas baseado na presença de nível máximo
  const particleCount = hasMaxLevel ? 30 : 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = hasMaxLevel ? 'particle fire-particle' : 'particle';
    
    // Posição aleatória
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Tamanho aleatório
    const size = Math.random() * 5 + 2;
    
    // Cor baseada em raridade alta ou fogo
    let colors;
    if (hasMaxLevel) {
      colors = ['#ff9800', '#ff5722', '#f44336', '#ffeb3b'];
    } else {
      colors = ['#4caf50', '#ffeb3b', '#ff9800', '#f44336'];
    }
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

// Substitui a função createParticleEffect pela versão melhorada
function createParticleEffect() {
  createFireParticleEffect();
}

// Atualiza a função renderSkillList para aplicar efeitos de fogo nos itens
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
      div.classList.add('fire-bar');
    }
    
    // Adiciona classe especial para o texto de nível máximo
    const levelClass = skill.value === 10 ? 'max-level-text' : '';
    
    div.innerHTML = `
      <span class="rarity-indicator rarity-${rarityClass}">${rarityClass}</span>
      <input type="text" value="${skill.name}" onchange="editSkillName(${index}, this.value)">
      <input type="number" min="0" max="10" value="${skill.value}" class="${levelClass}" onchange="editSkillValue(${index}, this.value)">
      <button class="remove-btn" onclick="removeSkill(${index})">X</button>
    `;
    container.appendChild(div);
  });
}
