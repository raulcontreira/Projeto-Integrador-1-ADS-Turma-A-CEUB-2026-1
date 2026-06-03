# Projeto-Integrador-1-ADS-Turma-A-CEUB-2026-1
Trabalho da Disciplina

Projeto : Iron Burguer
Objetivos iniciais : Criar um sistema funcional para um food truck

Descrição: Com um projeto integrado com a disciplina de quinta-feira( Análise e projeto de sistemas) vamos  desenvolver soluçõs praticas para os problemas adiministrativos, financeiros e organizacionais para o nosso cliente

Documentação Técnica: Sistema de Gestão de Pedidos (Iron Burger)

Equipe Técnica: 
    Geovanna de Freitas Santos : PO (Dev Team) Front/Back
    Gustavo Ramos de Azevedo : SM (Dev Team) Front/Back
    Raul Duarte Costa Contreira : (Dev Team)
    Giovanna Souza de Oliveira : DBA (Dev Team) Front/Back



1. Introdução e ContextualizaçãoO 

Iron Burger é uma aplicação web voltada ao gerenciamento de fluxos operacionais e comerciais de um food truck especializado em hambúrgueres artesanais. O projeto consiste em uma plataforma integrada que unifica a experiência do usuário final (cliente), a logística operacional (cozinha) e o controle estratégico (gestão administrativa) em um ecossistema digital unificado.

2. Escopo Funcional (Módulos do Sistema)
    2.1. Módulo do Cliente (Front-End / Interface do Usuário)
        
        Catálogo Digital Dinâmico: Renderização de produtos segmentados por categorias predefinidas (Hambúrgueres, Acompanhamentos e Bebidas).
        
        Gerenciamento de Carrinho: Algoritmo para adição/remoção de itens com cálculo automatizado de subtotal e taxas.
        
        Emissão de Pedidos: Geração de identificadores únicos para cada transação e feedback visual imediato por meio de componentes de interface de usuário (Modal).
    
    2.2. Módulo Operacional (Cozinha)
    
        Fila de Processamento: Monitoramento em tempo real das requisições pendentes.
        
        Máquina de Estados (Status do Pedido): Ciclo de vida do pedido estruturado em quatro etapas lineares: Recebido $\rightarrow$ Preparando $\rightarrow$ Pronto $\rightarrow$ Entregue.
        
        Métrica de Desempenho (Throughput): Cronômetro individual por pedido para mensurar o Tempo Médio de Atendimento (TMA).
        
        Painel Analítico Local: Indicadores quantitativos de volume de produção (pedidos totais, em andamento e finalizados).
        
    2.3. Módulo Administrativo (Gestão e Controladoria)
    
        Dashboard Executivo: Consolidação de dados financeiros (faturamento bruto) e volume de conversão (pedidos entregues).
        
        Gestão de Inventário (Estoque): Sistema de alerta visual estocástico para produtos com níveis críticos (limiar quantitativo $< 20$ unidades).
        
        Mapeamento de Demanda: Gráfico analítico de volumetria de vendas segmentado por produto.
        
3. Arquitetura de Software e Tecnologias

A solução adota o paradigma de desenvolvimento focado em performance do lado do cliente (client-side), priorizando a leveza e a manutenibilidade do código.
    
    Camada de Visão e Estilo: HTML5 estrutural e CSS3 avançado (layouts baseados em Flexbox/Grid), aplicando uma paleta cromática em modo escuro (Dark Mode — predominância de #ff4500 e #d32f2f) com tipografia sem serifa (Segoe UI/Sans-serif).
    
    Camada de Lógica: JavaScript Nativo (Vanilla JS) para manipulação assíncrona do DOM.
    
    Padrão Arquitetural: Single Page Application (SPA), eliminando a necessidade de múltiplos reloads de página e otimizando a experiência do usuário (UX).
    
    Persistência de Dados Provisória: Utilização da API Web Storage (LocalStorage) para manutenção dos estados e dados em nível de sessão.
    

Plaintextiron_burguer_app/
├── index.html          # Ponto de entrada da aplicação e estrutura semântica
├── styles.css          # Folha de estilos globais e regras de responsividade
├── app.js              # Core da aplicação (regras de negócio e manipulação do DOM)
└── README.md           # Documentação técnica do repositório

4. Engenharia de Requisitos e Regras de Negócio

    -Tributação: Aplicação automatizada de taxa de serviço fixa de $5\%$ sobre o subtotal bruto do carrinho.
    
    -Regra de Validação de Estoque: Bloqueio transacional que impede a inserção de produtos cujo estoque seja igual a zero, além de disparar sinalizadores visuais no módulo do gestor para insumos abaixo de 20 unidades.
    
    -Indexação de Pedidos: Atribuição de ID numérico incremental sequencial iniciado em #1001.
    
    -Responsividade Multiplataforma: Interface adaptável via Media Queries para três breakpoints principais: Desktop ($\ge 1920\text{px}$), Tablets ($768\text{px} - 1024\text{px}$) e Mobile ($320\text{px} - 767\text{px}$).
    
    4.1. Carga Inicial de Dados (Dataset do Protótipo)
    
    Produto	                    Preço Unitário (R$)	        Estoque Inicial (Unidades)
    Hambúrguer de Boi	          R$25,90	                        50
    Hambúrguer de Frango	      R$23,90	                        45
    Hambúrguer de Peixe	          R$24,90	                        40
    Batata Rústica	              R$14,00	                        100
    Batata Clássica	              R$12,00	                        100
    Refrigerante	              R$6,00	                        200
    Suco Natural	              R$8,00	                        80
    
    5. Limitações do Protótipo e Trabalhos Futuros
    
    Na presente versão de homologação, o sistema opera estritamente como um MVP (Mínimo Produto Viável). Dessa forma, os dados residem em memória volátil do navegador, o sistema não implementa camadas de criptografia ou controle de acesso baseado em papéis (RBAC — Role-Based Access Control), sendo a alternância de perfis feita via interface.
    
    Para a evolução do sistema (Fase 2), propõe-se o seguinte plano de desenvolvimento:
    
        Desacoplamento Arquitetural: Migração para modelo Cliente-Servidor utilizando ecossistema Node.js com Express.
        
        Persistência Robusta: Integração com Banco de Dados Relacional (PostgreSQL) e desenvolvimento de uma API RESTful.
        
        Segurança: Implementação de protocolo de autenticação e autorização via JWT (JSON Web Tokens).
        
        Comunicação Bidirecional: Substituição do modelo atual por WebSockets (Socket.io) para atualização assíncrona real-time entre cozinha e cliente.
        
        Módulo Financeiro: Integração com gateways de pagamento externo (Pix/Cartão).

    Codigo revisado, corrigido e auxiliado por : Manus.ia ,Claudecode, Professor Felipe pires (Desenvolvimento de Sistemas), Professor Wendell Cruzeiro (Desenvolvimento web) e Professor Eduardo Jose (Análise e Projeto de Sistemas)
        
Instituição: Centro Universitário de Brasília (CEUB)
Curso: Análise e Desenvolvimento de Sistemas
Disciplina: Projeto Integrador I
Ano de Execução: 2026

