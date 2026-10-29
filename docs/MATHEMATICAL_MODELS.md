# Modelos Matemáticos e Algoritmo de Score (B-Stocks)

O **B-Stocks** calcula todos os indicadores quantitativos de forma determinística no backend (`ValuationService`), utilizando a Inteligência Artificial exclusivamente para síntese qualitativa.

---

## 1. Preço Teto de Dividendos (Método Décio Bazin)

Determina o valor máximo a se pagar por uma ação para garantir um Dividend Yield (DY) mínimo desejado (padrão de **6% ao ano**):

$$\text{Preço Teto (Bazin)} = \frac{\text{Média Anual de Dividendos por Ação}}{0{,}06}$$

A margem de segurança percentual pelo método Bazin é dada por:

$$\text{Margem Bazin (\%)} = \left(\frac{\text{Preço Teto (Bazin)} - \text{Preço Atual}}{\text{Preço Atual}}\right) \times 100$$

- **Se $\text{Preço Atual} < \text{Preço Teto}$ ($\text{Margem} > 0\%$):** Margem de segurança positiva (compensa para carteira de dividendos).
- **Se $\text{Preço Atual} > \text{Preço Teto}$ ($\text{Margem} < 0\%$):** Ação cara para estratégia pura de renda passiva a 6% a.a.

---

## 2. Preço Justo de Benjamin Graham

Busca empresas descontadas em relação à conjugação entre geração de lucro e valor patrimonial:

$$\text{Preço Justo (Graham)} = \sqrt{22{,}5 \times \text{LPA} \times \text{VPA}}$$

Onde:
- $\text{LPA} = \frac{\text{Preço Atual}}{\text{P/L}}$ (Lucro por Ação)
- $\text{VPA} = \frac{\text{Preço Atual}}{\text{P/VP}}$ (Valor Patrimonial por Ação)
- A constante $22{,}5$ deriva do limite clássico de Graham: $\text{P/L máximo de } 15 \times \text{P/VP máximo de } 1{,}5 = 22{,}5$.
- Caso $\text{LPA} \le 0$ ou $\text{VPA} \le 0$, o modelo atribui $\text{Preço Justo} = 0$ e $\text{Margem Graham} = -100\%$.

---

## 3. Indicadores de Tendência Técnica

### A. Médias Móveis Simples (SMA 50 e SMA 200)
$$\text{SMA}_n = \frac{1}{n} \sum_{i=1}^{n} P_i$$

Classificação da estrutura de tendência:
- **Alta Estrutural (Golden Cross):** $\text{Preço} > \text{SMA}_{50} > \text{SMA}_{200}$
- **Tendência de Alta:** $\text{Preço} > \text{SMA}_{50}$
- **Tendência de Baixa (Death Cross):** $\text{Preço} < \text{SMA}_{50} < \text{SMA}_{200}$
- **Lateral / Neutro:** Demais configurações

### B. Índice de Força Relativa — IFR / RSI (14 períodos)
$$\text{RSI}_{14} = 100 - \left(\frac{100}{1 + \text{RS}}\right), \quad \text{onde } \text{RS} = \frac{\text{Média de Ganhos (14p)}}{\text{Média de Perdas (14p)}}$$

- **$\text{RSI} > 70$:** Ativo sobrecomprado (risco elevado de correção técnica).
- **$\text{RSI} < 30$:** Ativo sobrevendido (potencial repique comprador).
- **$30 \le \text{RSI} \le 65$:** Zona saudável de acumulação.

---

## 4. Filtros de Corte e Score Único (0 a 100)

### A. Filtros de Corte Eliminatórios
1. **Liquidez Média Diária $\ge \text{R\$ } 1.000.000$:** Elimina ativos sem liquidez institucional/pessoa física.
2. **$\text{Dívida Líquida / EBITDA} < 3{,}0\text{x}$:** Elimina empresas não financeiras superendividadas.
   - *Nota algébrica:* A partir dos múltiplos do Fundamentus ($\text{EV/EBITDA}$, $\text{P/EBIT}$ e $\text{EV/EBIT}$), a relação exata é obtida via:
     $$\frac{\text{Dívida Líquida}}{\text{EBITDA}} = \text{EV/EBITDA} \times \left(1 - \frac{\text{P/EBIT}}{\text{EV/EBIT}}\right)$$

### B. Pesos do Score (0 a 100 pontos)
| Pilar | Peso Máximo | Critério de Pontuação |
| :--- | :--- | :--- |
| **1. Margem de Segurança (Graham / Bazin)** | **35 pontos (35%)** | Proporcional ao desconto frente ao Preço Justo de Graham e ao Preço Teto de Bazin. |
| **2. Histórico e Dividend Yield** | **25 pontos (25%)** | Pontua progressivamente ativos com $\text{DY} \ge 6\%$ a.a. sustentáveis. |
| **3. Rentabilidade Operacional** | **20 pontos (20%)** | Avalia $\text{ROE} \ge 15\%$ (55% do pilar) e $\text{Margem Líquida} \ge 10\%$ (45% do pilar). |
| **4. Momento Técnico** | **20 pontos (20%)** | Soma alinhamento de Médias Móveis SMA 50/200 (até 12 pts) e RSI 14 saudável (até 8 pts). |

Ativos que reprovam nos filtros de corte sofrem penalização de 45% no Score Total e recebem alerta explícito na listagem.

---

## 5. Classificação Temática Automática

Cada empresa da B3 é rotulada automaticamente em um dos 4 perfis:
1. **Renda / Vacas Leiteiras:** $\text{DY} \ge 6{,}0\%$, $\text{ROE} \ge 12\%$ e $\text{Margem Líquida} \ge 8\%$.
2. **Crescimento Agressivo:** ($\text{Crescimento de Receita 5a} \ge 12\%$ ou $\text{ROE} \ge 20\%$), $\text{DY} < 6{,}0\%$ e $\text{P/L} > 0$.
3. **Turnaround / Risco Alto:** $\text{P/L} \le 0$, $\text{ROE} < 4\%$, $\text{Margem Líquida} < 0\%$ ou $\text{Dívida Líquida/EBITDA} \ge 3{,}5\text{x}$.
4. **Defensiva:** Empresas lucrativas e estáveis nos demais parâmetros.

