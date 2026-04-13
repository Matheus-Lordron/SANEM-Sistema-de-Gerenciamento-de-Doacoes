SELECT i.nome, i.tamanho, c.nome AS categoria, i.quantidade_estoque
FROM item i
JOIN categoria_item c ON c.id = i.categoria_id
ORDER BY c.nome, i.nome, i.tamanho;

SELECT * FROM vw_consumo_mensal_beneficiario;

SELECT 
  tipo,
  DATE_FORMAT(data_movimentacao, '%m/%Y')  AS mes_ano,
  MONTHNAME(data_movimentacao)             AS nome_mes,
  COUNT(*)                                 AS qtd_movimentacoes,
  SUM(mi.quantidade)                       AS total_itens_movimentados
FROM movimentacao m
JOIN movimentacao_item mi ON mi.movimentacao_id = m.id
GROUP BY tipo, mes_ano, nome_mes
ORDER BY mes_ano, tipo;