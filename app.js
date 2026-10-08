import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const logo="data:image/png;base64,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";

    /* =========================================================
   CONFIGURACAO FIREBASE
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyAxCsnznNdkxgG1Z8139mxVQovmvQwTj_o",
    authDomain: "formulario-verificacao-diaria.firebaseapp.com",
    projectId: "formulario-verificacao-diaria",
    storageBucket: "formulario-verificacao-diaria.firebasestorage.app",
    messagingSenderId: "92344286973",
    appId: "1:92344286973:web:67ab3f7011be3ec8e84894",
    measurementId: "G-2LXSN1B5TS"
};


const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);

const auth =
    getAuth(app);


/* =========================================================
   DADOS DO DOCUMENTO
========================================================= */

const codigoFormulario =
    "FOR-QUA-2026";

const revisaoFormulario =
    "04";

const dataRevisao =
    "30/09/2026";


/* =========================================================
   PRODUTOS
========================================================= */

const produtos = [
    "12950020IBINH",
    "15950020IBINH",
    "18950020IBINH",
    "20650020IBINISO",
    "24950020IBINI",
    "08650020IBH",
    "10650020IBH",
    "12650020IBH",
    "15650020IBH",
    "18650020IBH",
    "24650020IBH",
    "30650020IBH",
    "36650020IBH",
    "42650020IBH",
    "48650020IBH",
    "60650020IBH",
    "18300020IBH",
    "24300020IBH",
    "30300020IBH",
    "36300020IBH",
    "42300020IBH",
    "48300020IBH",
    "60300020IBH",
    "08650020IBDWH",
    "10650020IBDWH",
    "12650020DWH",
    "15650020DWH",
    "18650020DWH",
    "30650020DWH",
    "36650020DWH",
    "42650020DWH",
    "48650020DWH",
    "60650020DWH",
    "12650020IBISO4",
    "12650020IBISO8",
    "16650020IBISO4",
    "16650020IBISO6",
    "20650020IBISO4",
    "20650020IBISO6",
    "24650020IBISO4",
    "24650020IBISO6",
    "32650020IBISO4",
    "42650020IBISO4",
    "48650020IBISO4",
    "16650020DWI",
    "20650020DWI",
    "24650020DWI",
    "32650020DWI",
    "24650020DWHI",
    "42650020DWHI",
    "48650020DWHI"
];


const produtosSelecionados = {
    "3020": "", "3660": "", "3021": "", "3661": ""
};


/* =========================================================
   DADOS ESPECIAIS G1
========================================================= */

const dadosGranulacao = {
    G1: { material: "NSE", pesoBag: "" },
    G2: { material: "NSE", pesoBag: "" }
};


/* =========================================================
   VERIFICACOES 3020 E 3660
========================================================= */

const parametrosTubo = [
    "Comprimento Trim",
    "Comprimento Tubo",
    "Alinhamento da emenda do molde",
    "Marcacoes a cada 2 metros correta",
    "Tubo rebarbado e com anel",
    "Faixa corporativa",
    "Estado da corruga",
    "Parede interna",
    "Cinta bem soldada",
    "Corte da bolsa feita",
    "MP correta",
    "Die Lines",
    "Die Line Pitting",
    "Aspecto visual",
    "Revisao visual completa",
    "Tubo retilineo e circular",
    "Inspecao a cada 2 horas",
    "Analise de Negro de Fumo",
    "Fichas corretas"
];


/* =========================================================
   VERIFICACOES G1

   MATERIAL E PESO DO BAG NAO SAO C / NC / NA
========================================================= */

const parametrosG1 = [
    "Tamanho dos Graos",
    "Furos Internos",
    "Rebarbas nos Graos",
    "Visual do Bag",
    "Etiqueta correta",
    "Teste de Prensa",
    "RPM",
    "Temperatura",
    "Revisao visual completa",
    "Ficha de Dados",
    "Informacoes adicionais"
];


/* =========================================================
   RESPOSTAS
========================================================= */

const resultados = {
    "3020": {}, "3660": {}, "G1": {},
    "3021": {}, "3661": {}, "G2": {}
};
const linhasPorPlanta = {
    MDA: ["3020", "3660", "G1"],
    RCO: ["3020", "3660", "G1", "3021", "3661", "G2"]
};

function linhasAtivas() {
    const seletor = document.getElementById("planta");
    const planta = seletor ? seletor.value : "MDA";
    return linhasPorPlanta[planta] || linhasPorPlanta.MDA;
}


let historicoAtual = [];


/* =========================================================
   ELEMENTOS HTML
========================================================= */

const linhaSelect =
    document.getElementById("linha");

const produtoSelect =
    document.getElementById("produto");

const areaProduto =
    document.getElementById("areaProduto");

const areaG1 =
    document.getElementById("areaG1");

const pesoBag =
    document.getElementById("pesoBag");

const verificacoesDiv =
    document.getElementById("verificacoes");

const tituloLinha =
    document.getElementById("tituloLinha");

const statusLinha =
    document.getElementById("statusLinha");

const statusGeral =
    document.getElementById("statusGeral");

const btnFinalizar =
    document.getElementById("btnFinalizar");

const btnHistorico =
    document.getElementById("btnHistorico");

const btnFecharHistorico =
    document.getElementById("btnFecharHistorico");

const painelHistorico =
    document.getElementById("painelHistorico");

const listaHistorico =
    document.getElementById("listaHistorico");

const mensagem =
    document.getElementById("mensagem");


/* =========================================================
   CARREGAR PRODUTOS
========================================================= */

function carregarListaProdutos() {

    if (!produtoSelect) {
        console.error(
            "Campo produto nao encontrado."
        );

        return;
    }


    produtoSelect.innerHTML = "";


    const primeiraOpcao =
        document.createElement("option");


    primeiraOpcao.value = "";

    primeiraOpcao.textContent =
        "Selecione o produto";


    produtoSelect.appendChild(
        primeiraOpcao
    );


    produtos.forEach(
        function(produto) {

            const option =
                document.createElement("option");


            option.value =
                produto;

            option.textContent =
                produto;


            produtoSelect.appendChild(
                option
            );
        }
    );


    console.log(
        "Produtos carregados:",
        produtos.length
    );
}


/* =========================================================
   PARAMETROS POR LINHA
========================================================= */

function parametrosDaLinha(linha) {

    if (linha === "G1" || linha === "G2") {

        return parametrosG1;
    }


    return parametrosTubo;
}


/* =========================================================
   STATUS DA LINHA
========================================================= */

function calcularStatus(linha) {

    const parametros =
        parametrosDaLinha(linha);

    const respostas =
        resultados[linha];


    let completo = true;

    let naoConforme = false;


    /* Produto obrigatorio */

    if (
        ["3020","3660","3021","3661"].includes(linha)
    ) {

        if (
            !produtosSelecionados[linha]
        ) {

            completo = false;
        }
    }


    /* Peso do Bag obrigatorio */

    if (linha === "G1" || linha === "G2") {

        if (
            dadosGranulacao[linha].pesoBag === ""
        ) {

            completo = false;
        }


        if (
            Number(dadosGranulacao[linha].pesoBag) <= 0
        ) {

            completo = false;
        }
    }


    parametros.forEach(
        function(parametro) {

            if (
                !respostas[parametro]
            ) {

                completo = false;
            }


            if (
                respostas[parametro] === "NC"
            ) {

                naoConforme = true;
            }
        }
    );


    if (!completo) {

        return "PENDENTE";
    }


    if (naoConforme) {

        return "NAO CONFORME";
    }


    return "CONFORME";
}


/* =========================================================
   COR DO STATUS
========================================================= */

function classeStatus(status) {

    if (status === "CONFORME") {

        return "status conforme";
    }


    if (
        status === "NAO CONFORME"
    ) {

        return "status nao-conforme";
    }


    return "status pendente";
}


/* =========================================================
   ATUALIZAR STATUS
========================================================= */

function atualizarResumo() {
    const ativas = linhasAtivas();
    ativas.concat(["3020","3660","G1","3021","3661","G2"]).filter((v,i,a)=>a.indexOf(v)===i).forEach(linha => {
        const el=document.getElementById("resumo"+linha);
        if(el) { el.closest("div").style.display=ativas.includes(linha)?"flex":"none"; el.textContent=calcularStatus(linha); }
    });
    if(statusLinha && linhaSelect){ const st=calcularStatus(linhaSelect.value); statusLinha.textContent=st; statusLinha.className=classeStatus(st)+" status-linha"; }
    let geral="PENDENTE";
    const sts=ativas.map(calcularStatus);
    if(sts.every(x=>x!=="PENDENTE")) geral=sts.includes("NAO CONFORME")?"NAO CONFORME":"CONFORME";
    if(statusGeral){ statusGeral.textContent=geral; statusGeral.className=classeStatus(geral); }
    if(btnFinalizar) btnFinalizar.disabled=geral==="PENDENTE";
}
/* =========================================================
   C / NC / N/A
========================================================= */

function marcarTodos(linha, valor) {
    parametrosDaLinha(linha).forEach(function(parametro) {
        resultados[linha][parametro] = valor;
    });
    carregarVerificacoes();
}

function criarBotoesMarcarTodos(linha) {
    let grupo = document.getElementById("acoesEmMassa");
    if (!grupo) {
        grupo = document.createElement("div");
        grupo.id = "acoesEmMassa";
        grupo.className = "acoes-em-massa";
        const titulo = document.querySelector(".titulo-verificacao");
        if (titulo) titulo.appendChild(grupo);
    }
    grupo.innerHTML = "";
    [["C","Todos C","todos-c"],["NC","Todos NC","todos-nc"],["NA","Todos N/A","todos-na"]].forEach(function(cfg) {
        const btn = document.createElement("button");
        btn.type = "button"; btn.textContent = cfg[1]; btn.className = "btn-massa " + cfg[2];
        btn.addEventListener("click", function() {
            const nome = cfg[0] === "C" ? "Conforme" : cfg[0] === "NC" ? "Nao Conforme" : "N/A";
            if (confirm("Marcar todas as verificacoes de " + linha + " como " + nome + "?")) marcarTodos(linha, cfg[0]);
        });
        grupo.appendChild(btn);
    });
}

function criarOpcao(
    local,
    linha,
    parametro,
    indice,
    valor,
    texto,
    classe
) {

    const label =
        document.createElement("label");


    label.className =
        "opcao " + classe;


    const input =
        document.createElement("input");


    input.type =
        "radio";


    input.name =
        "item-" +
        linha +
        "-" +
        indice;


    input.value =
        valor;


    if (
        resultados[linha][parametro] ===
        valor
    ) {

        input.checked = true;
    }


    const span =
        document.createElement("span");


    span.textContent =
        texto;


    input.addEventListener(
        "change",
        function() {

            resultados[linha][parametro] =
                valor;


            atualizarResumo();
        }
    );


    label.appendChild(input);

    label.appendChild(span);

    local.appendChild(label);
}


/* =========================================================
   CARREGAR VERIFICACOES
========================================================= */

function carregarVerificacoes() {

    if (
        !linhaSelect ||
        !verificacoesDiv
    ) {

        console.error(
            "Area de verificacoes nao encontrada."
        );

        return;
    }


    const linha =
        linhaSelect.value;


    const parametros =
        parametrosDaLinha(linha);


    verificacoesDiv.innerHTML = "";


    /* G1 */

    if (linha === "G1" || linha === "G2") {

        if (areaProduto) {

            areaProduto.style.display =
                "none";
        }


        if (areaG1) {

            areaG1.classList.remove(
                "escondido"
            );
        }


        if (pesoBag) {

            pesoBag.value =
                dadosGranulacao[linha].pesoBag;
        }


        if (tituloLinha) {

            tituloLinha.textContent =
                "Verificacoes - Granulacao " + linha;
        }

    }


    /* 3020 E 3660 */

    else {

        if (areaProduto) {

            areaProduto.style.display =
                "block";
        }


        if (areaG1) {

            areaG1.classList.add(
                "escondido"
            );
        }


        if (produtoSelect) {

            produtoSelect.value =
                produtosSelecionados[
                    linha
                ];
        }


        if (tituloLinha) {

            tituloLinha.textContent =
                "Verificacoes - Linha " +
                linha;
        }
    }


    criarBotoesMarcarTodos(linha);

    parametros.forEach(
        function(parametro, indice) {

            const item =
                document.createElement("div");


            item.className =
                "item-verificacao";


            const nome =
                document.createElement("div");


            nome.className =
                "nome-parametro";


            const texto =
                document.createElement("span");


           const parametrosFormatados = {

    "Alinhamento da emenda do molde":
        "Alinhamento da<br>emenda do molde",

    "Marcacoes a cada 2 metros correta":
        "Marcacoes a cada<br>2 metros correta",

    "Tubo rebarbado e com anel":
        "Tubo rebarbado<br>e com anel",

    "Revisao visual completa":
        "Revisao visual<br>completa",

    "Tubo retilineo e circular":
        "Tubo retilineo<br>e circular",

    "Inspecao a cada 2 horas":
        "Inspecao a cada<br>2 horas",

    "Analise de Negro de Fumo":
        "Analise de Negro<br>de Fumo"
};

texto.innerHTML =
    parametrosFormatados[parametro]
    || parametro;

            nome.appendChild(
                texto
            );


            const opcoes =
                document.createElement("div");


            opcoes.className =
                "opcoes";


            criarOpcao(
                opcoes,
                linha,
                parametro,
                indice,
                "C",
                "C",
                "c"
            );


            criarOpcao(
                opcoes,
                linha,
                parametro,
                indice,
                "NC",
                "NC",
                "nc"
            );


            criarOpcao(
                opcoes,
                linha,
                parametro,
                indice,
                "NA",
                "N/A",
                "na"
            );


            item.appendChild(
                nome
            );


            item.appendChild(
                opcoes
            );


            verificacoesDiv.appendChild(
                item
            );
        }
    );


    console.log(
        "Verificacoes carregadas:",
        linha,
        parametros.length
    );


    atualizarResumo();
}


/* =========================================================
   EVENTO PRODUTO
========================================================= */

if (produtoSelect) {

    produtoSelect.addEventListener(
        "change",
        function() {

            if (!linhaSelect) {

                return;
            }


            const linha =
                linhaSelect.value;


            if (["3020","3660","3021","3661"].includes(linha)) {

                produtosSelecionados[
                    linha
                ] =
                    produtoSelect.value;
            }


            atualizarResumo();
        }
    );
}


/* =========================================================
   EVENTO PESO DO BAG
========================================================= */

if (pesoBag) {

    pesoBag.addEventListener(
        "input",
        function() {

            const linhaAtual = linhaSelect ? linhaSelect.value : "G1";
            if (dadosGranulacao[linhaAtual]) {
                dadosGranulacao[linhaAtual].pesoBag = pesoBag.value;
            }


            atualizarResumo();
        }
    );
}


/* =========================================================
   TROCAR PLANTA
========================================================= */

const plantaSelect = document.getElementById("planta");

function atualizarLinhasDaPlanta() {
    if (!linhaSelect) return;

    const anterior = linhaSelect.value;
    const linhas = linhasAtivas();

    linhaSelect.innerHTML = "";

    linhas.forEach(function(linha) {
        const opcao = document.createElement("option");
        opcao.value = linha;
        opcao.textContent = linha;
        linhaSelect.appendChild(opcao);
    });

    linhaSelect.value = linhas.includes(anterior) ? anterior : linhas[0];

    carregarVerificacoes();
    atualizarResumo();
}

if (plantaSelect) {
    plantaSelect.addEventListener("change", atualizarLinhasDaPlanta);
}

/* =========================================================
   TROCAR LINHA
========================================================= */

if (linhaSelect) {

    linhaSelect.addEventListener(
        "change",
        function() {

            carregarVerificacoes();
        }
    );
}


/* =========================================================
   DATA ATUAL
========================================================= */

function colocarDataAtual() {

    const campoData =
        document.getElementById(
            "data"
        );


    if (!campoData) {

        return;
    }


    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            hoje.getDate()
        ).padStart(
            2,
            "0"
        );


    campoData.value =
        ano +
        "-" +
        mes +
        "-" +
        dia;
}


/* =========================================================
   DATA BRASILEIRA
========================================================= */

function formatarData(data) {

    const partes =
        String(data || "")
            .split("-");


    if (
        partes.length !== 3
    ) {

        return data;
    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );
}


/* =========================================================
   TEXTO DO RESULTADO
========================================================= */

function textoResultado(valor) {

    if (valor === "C") {

        return "Conforme";
    }


    if (valor === "NC") {

        return "Nao Conforme";
    }


    if (valor === "NA") {

        return "N/A";
    }


    return "Pendente";
}


/* =========================================================
   MONTAR FOLHA
========================================================= */

function montarFolha() {
    const nome = document.getElementById("nome");
    const data = document.getElementById("data");
    const turno = document.getElementById("turno");
    const observacao = document.getElementById("observacao");
    const planta = document.getElementById("planta");
    const folha = {
        planta: planta ? planta.value : "MDA",
        codigoFormulario, revisao: revisaoFormulario, dataRevisao,
        responsavel: nome ? nome.value : "", data: data ? data.value : "", turno: turno ? turno.value : "",
        observacao: observacao ? observacao.value.trim() : "",
        statusGeral: statusGeral ? statusGeral.textContent : "PENDENTE", linhas: {}
    };
    ["3020","3021","3660","3661"].forEach(function(linha) {
        folha.linhas[linha] = { produto: produtosSelecionados[linha], status: calcularStatus(linha), verificacoes: {...resultados[linha]} };
    });
    ["G1","G2"].forEach(function(linha) {
        folha.linhas[linha] = { material: "NSE", pesoBagKg: dadosGranulacao[linha].pesoBag, status: calcularStatus(linha), verificacoes: {...resultados[linha]} };
    });
    return folha;
}

/* =========================================================
   VALIDAR
========================================================= */

function validarFolha() {
    const nome=document.getElementById("nome"), data=document.getElementById("data"), turno=document.getElementById("turno");
    if(!nome || !nome.value) return "Selecione o responsavel.";
    if(!data || !data.value) return "Informe a data.";
    if(!turno || !turno.value) return "Selecione o turno.";
    for(const linha of linhasAtivas()){
        if(["3020","3660","3021","3661"].includes(linha) && !produtosSelecionados[linha]) return "Selecione o produto da "+linha+".";
        if(calcularStatus(linha)==="PENDENTE") return "Preencha completamente a linha "+linha+".";
    }
    return "";
}
/* =========================================================
   ESCREVER NO PDF
========================================================= */

function escreverPDF(
    doc,
    texto,
    y,
    negrito
) {

    if (y > 275) {

        doc.addPage();

        y = 18;
    }


    doc.setFont(
        "helvetica",
        negrito
            ? "bold"
            : "normal"
    );


    const linhas =
        doc.splitTextToSize(
            texto,
            180
        );


    doc.text(
        linhas,
        15,
        y
    );


    return (
        y +
        linhas.length * 5
    );
}

const nomesAbreviados = {

    "Comprimento Trim": "Comp.Trim",
    "Comprimento Tubo": "Comp.Tubo",
    "Alinhamento da emenda do molde": "Alinhamento",
    "Marcacoes a cada 2 metros correta": "Marcacao",
    "Tubo rebarbado e com anel": "Reb./Anel",
    "Faixa corporativa": "Faixa",
    "Estado da corruga": "Corruga",
    "Parede interna": "Parede",
    "Cinta bem soldada": "Cinta",
    "Corte da bolsa feita": "Bolsa",
    "MP correta": "MP",
    "Die Lines": "Die",
    "Die Line Pitting": "Pit",
    "Aspecto visual": "Aspecto",
    "Revisao visual completa": "Visual",
    "Tubo retilineo e circular": "Ret/Circ",
    "Inspecao a cada 2 horas": "Ins.2h",
    "Analise de Negro de Fumo": "Negro",
    "Fichas corretas": "Ficha",

    "Tamanho dos Graos": "Graos",
    "Furos Internos": "Furos",
    "Rebarbas nos Graos": "Rebarbas",
    "Visual do Bag": "Bag",
    "Etiqueta correta": "Etiqueta",
    "Teste de Prensa": "Prensa",
    "RPM": "RPM",
    "Temperatura": "Temp",
    "Ficha de Dados": "Ficha",
    "Informacoes adicionais": "Info"
};

/* =========================================================
   GERAR PDF
========================================================= */

function gerarPDF(folha) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("Biblioteca de PDF nao carregada.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const rco = folha.planta === "RCO";

    /* CABECALHO PRINCIPAL */
    doc.setFillColor(27,94,32); doc.rect(0,0,297,15,"F");
    doc.setFillColor(255,255,255); doc.roundedRect(5,2,48,11,1,1,"F");
    doc.addImage(logo,"PNG",7,3,44,9);
    doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(13);
    doc.text("LISTA DE VERIFICACAO DIARIA",148,9,{align:"center"});
    doc.setFontSize(6); doc.text(codigoFormulario,290,6,{align:"right"});
    doc.text("REV: "+revisaoFormulario,290,9,{align:"right"});
    doc.text(dataRevisao,290,12,{align:"right"});

    /* IDENTIFICACAO */
    doc.setTextColor(0,0,0); doc.setDrawColor(0,0,0); doc.setLineWidth(0.6);
    doc.setFillColor(242,242,242); doc.rect(8,20,281,16,"FD");
    doc.line(85,20,85,36); doc.line(150,20,150,36); doc.line(200,20,200,36);
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(27,94,32);
    doc.text("RESPONSAVEL",12,25); doc.text("DATA",89,25); doc.text("TURNO",154,25); doc.text("STATUS GERAL",204,25);
    doc.setTextColor(0,0,0); doc.setFontSize(9);
    doc.text(folha.responsavel||"-",12,32); doc.text(formatarData(folha.data),89,32); doc.text(folha.turno||"-",154,32);
    if(folha.statusGeral==="CONFORME") doc.setTextColor(0,120,0);
    else if(folha.statusGeral==="NAO CONFORME") doc.setTextColor(180,0,0);
    else doc.setTextColor(100,100,100);
    doc.text(folha.statusGeral||"PENDENTE",204,32); doc.setTextColor(0,0,0);

    function bloco(titulo,a,b,x,y,params,nomes) {
        const w=88, nomeW=50, valW=19, row=5.65;
        const granulacao = titulo === "G1 / G2";

        /* FAIXA VERDE SEMPRE COM A MESMA LARGURA EM MDA E RCO */
        doc.setFillColor(27,105,32); doc.setTextColor(255,255,255);
        doc.setFont("helvetica","bold"); doc.setFontSize(8);
        doc.roundedRect(x,y,w,6.2,.8,.8,"F"); doc.text(titulo,x+2,y+4.3); y+=6.2;

        const centroA=x+nomeW+(valW/2);
        const centroB=x+nomeW+valW+(valW/2);

        /* LINHA 1: | VERIFICACAO | MAQUINA A | MAQUINA B | */
        const h1=5.5;
        doc.setFillColor(238,242,244); doc.setTextColor(0,0,0); doc.setDrawColor(0,0,0);
        doc.rect(x,y,nomeW,h1,"FD");
        doc.rect(x+nomeW,y,valW,h1,"FD");
        doc.rect(x+nomeW+valW,y,valW,h1,"FD");
        doc.setFont("helvetica","bold"); doc.setFontSize(7.2);
        doc.text("VERIFICACAO",x+1.3,y+3.7);
        doc.text(nomes[0],centroA,y+3.7,{align:"center"});
        doc.text(nomes[1],centroB,y+3.7,{align:"center"});
        y+=h1;

        /* LINHA 2: PRODUTO OU MATERIAL/PESO */
        const h2=8;
        doc.setFillColor(250,250,250);
        doc.rect(x,y,nomeW,h2,"FD");
        doc.rect(x+nomeW,y,valW,h2,"FD");
        doc.rect(x+nomeW+valW,y,valW,h2,"FD");
        doc.setTextColor(0,0,0); doc.setFont("helvetica","bold"); doc.setFontSize(5.6);
        doc.text(granulacao ? "MATERIAL / PESO" : "PRODUTO",x+1.3,y+4.8);

        if (granulacao) {
            doc.setFontSize(5.8);
            doc.text(a.material||"NSE",centroA,y+3,{align:"center"});
            doc.setFontSize(5.3);
            doc.text((a.pesoBagKg||"-")+" kg",centroA,y+6.2,{align:"center"});
            if(rco) {
                doc.setFontSize(5.8); doc.text(b.material||"NSE",centroB,y+3,{align:"center"});
                doc.setFontSize(5.3); doc.text((b.pesoBagKg||"-")+" kg",centroB,y+6.2,{align:"center"});
            } else {
                doc.setFontSize(7); doc.setTextColor(110,110,110); doc.text("-",centroB,y+4.8,{align:"center"});
            }
        } else {
            doc.setFontSize(5.1);
            const prodA=doc.splitTextToSize(a.produto||"-",valW-1.2);
            doc.text(prodA.slice(0,2),centroA,y+3.1,{align:"center"});
            if(rco) {
                const prodB=doc.splitTextToSize(b.produto||"-",valW-1.2);
                doc.text(prodB.slice(0,2),centroB,y+3.1,{align:"center"});
            } else {
                doc.setFontSize(7); doc.setTextColor(110,110,110); doc.text("-",centroB,y+4.8,{align:"center"});
            }
        }
        y+=h2;

        /* VERIFICACOES */
        params.forEach(function(param) {
            doc.setTextColor(0,0,0); doc.setFont("helvetica","normal"); doc.setFontSize(6.2);
            doc.rect(x,y,nomeW,row);
            const linhas=doc.splitTextToSize(param,nomeW-2);
            if(linhas.length===1) doc.text(linhas[0],x+1,y+3.65);
            else doc.text(linhas.slice(0,2),x+1,y+2.15);

            function celula(obj,cx,disponivel) {
                if(!disponivel) {
                    doc.setFillColor(238,238,238); doc.setTextColor(110,110,110);
                    doc.rect(cx,y,valW,row,"FD");
                    doc.setFont("helvetica","bold"); doc.setFontSize(7.6);
                    doc.text("-",cx+valW/2,y+3.85,{align:"center"});
                    return;
                }
                const v=(obj.verificacoes&&obj.verificacoes[param])||"NA";
                if(v==="C"){doc.setFillColor(190,235,190);doc.setTextColor(0,105,0);}
                else if(v==="NC"){doc.setFillColor(255,195,195);doc.setTextColor(180,0,0);}
                else{doc.setFillColor(220,220,220);doc.setTextColor(70,70,70);}
                doc.rect(cx,y,valW,row,"FD");
                doc.setFont("helvetica","bold"); doc.setFontSize(7.6);
                doc.text(v,cx+valW/2,y+3.85,{align:"center"});
            }

            celula(a,x+nomeW,true);
            celula(b,x+nomeW+valW,rco);
            y+=row;
        });
    }

    bloco("3020 / 3021",folha.linhas["3020"],folha.linhas["3021"],8,40,parametrosTubo,["3020","3021"]);
    bloco("3660 / 3661",folha.linhas["3660"],folha.linhas["3661"],102,40,parametrosTubo,["3660","3661"]);
    bloco("G1 / G2",folha.linhas.G1,folha.linhas.G2,196,40,parametrosG1,["G1","G2"]);

    /* OBSERVACOES NO RODAPE */
    const obsY=176, obsH=22;
    doc.setFillColor(27,105,32); doc.setTextColor(255,255,255); doc.rect(8,obsY,281,6,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.text("OBSERVACOES",148,obsY+4.1,{align:"center"});
    doc.setTextColor(0,0,0); doc.rect(8,obsY+6,281,obsH);
    doc.setFont("helvetica","normal"); doc.setFontSize(7.5);
    const obs=doc.splitTextToSize(folha.observacao||"",270); doc.text(obs.slice(0,4),11,obsY+12);

    const dataArquivo=String(folha.data||"").split("-").reverse().join("-");
    doc.save("Verificacao_Diaria_"+folha.planta+"_"+dataArquivo+"_Turno_"+folha.turno+".pdf");
}

/* =========================================================
   FINALIZAR

   NAO HA POWER AUTOMATE.
   NAO HA ONEDRIVE.
   NAO HA PYTHON.
========================================================= */

async function finalizarFolha() {

    const erro =
        validarFolha();


    if (erro) {

        alert(erro);

        return;
    }


    const folha =
        montarFolha();


    if (btnFinalizar) {

        btnFinalizar.disabled =
            true;
    }


    if (mensagem) {

        mensagem.textContent =
            "Salvando online...";
    }


    try {

        await addDoc(

            collection(
                db,
                "verificacoes_diarias"
            ),

            Object.assign(
                {},
                folha,
                {

                    criadoEm:
                        serverTimestamp(),

                    uid:
                        auth.currentUser
                            ? auth.currentUser.uid
                            : ""
                }
            )
        );


        if (mensagem) {

            mensagem.textContent =
                "Salvo online. Gerando PDF...";
        }


        gerarPDF(
            folha
        );


        if (mensagem) {

            mensagem.textContent =
                "Folha salva e PDF gerado.";
        }


    } catch (erroFirebase) {

        console.error(
            "ERRO AO SALVAR:",
            erroFirebase
        );


        const codigoErro =
            erroFirebase.code
                ? erroFirebase.code
                : "sem codigo";


        const mensagemErro =
            erroFirebase.message
                ? erroFirebase.message
                : String(
                    erroFirebase
                );


        if (mensagem) {

            mensagem.textContent =
                "Erro Firebase: " +
                codigoErro;
        }


        alert(
            "Nao foi possivel salvar a folha.\n\n" +
            "Codigo: " +
            codigoErro +
            "\n\nErro: " +
            mensagemErro
        );
    }


    atualizarResumo();
}


/* =========================================================
   HISTORICO
========================================================= */

function mostrarHistorico() {

    if (!listaHistorico) {

        return;
    }


    listaHistorico.innerHTML = "";


    if (
        historicoAtual.length === 0
    ) {

        const vazio =
            document.createElement("p");


        vazio.textContent =
            "Nenhuma verificacao salva.";


        listaHistorico.appendChild(
            vazio
        );


        return;
    }


    historicoAtual.forEach(
        function(item) {

            const folha =
                item.dados;


            const registro =
                document.createElement(
                    "div"
                );


            registro.className =
                "registro";


            const titulo =
                document.createElement(
                    "h3"
                );


            titulo.textContent =
                formatarData(
                    folha.data
                ) +
                " - Turno " +
                folha.turno;


            registro.appendChild(
                titulo
            );


            const responsavel =
                document.createElement(
                    "p"
                );


            responsavel.textContent =
                "Responsavel: " +
                folha.responsavel;


            registro.appendChild(
                responsavel
            );


            /* 3020 */

            const linha3020 =
                document.createElement(
                    "p"
                );


            linha3020.textContent =
                "3020 - Produto: " +
                folha
                    .linhas["3020"]
                    .produto +
                " - " +
                folha
                    .linhas["3020"]
                    .status;


            registro.appendChild(
                linha3020
            );


            /* 3660 */

            const linha3660 =
                document.createElement(
                    "p"
                );


            linha3660.textContent =
                "3660 - Produto: " +
                folha
                    .linhas["3660"]
                    .produto +
                " - " +
                folha
                    .linhas["3660"]
                    .status;


            registro.appendChild(
                linha3660
            );


            /* G1 */

            const linhaG1 =
                document.createElement(
                    "p"
                );


            const pesoHistorico =
                folha.linhas.G1
                    .pesoBagKg
                    ? folha
                        .linhas.G1
                        .pesoBagKg +
                      " kg"
                    : "peso nao informado";


            linhaG1.textContent =
                "G1 - Material NSE - " +
                pesoHistorico +
                " - " +
                folha
                    .linhas.G1
                    .status;


            registro.appendChild(
                linhaG1
            );


            const geral =
                document.createElement(
                    "p"
                );


            geral.textContent =
                "Status geral: " +
                folha.statusGeral;


            registro.appendChild(
                geral
            );


            /* PDF */

            const botaoPDF =
                document.createElement(
                    "button"
                );


            botaoPDF.className =
                "btn primario";


            botaoPDF.textContent =
                "Baixar PDF";


            botaoPDF.addEventListener(
                "click",
                function() {

                    gerarPDF(
                        folha
                    );
                }
            );


            registro.appendChild(
                botaoPDF
            );


            listaHistorico.appendChild(
                registro
            );
        }
    );
}


/* =========================================================
   FIREBASE
========================================================= */

async function iniciarFirebase() {

    try {

        await signInAnonymously(
            auth
        );


        if (mensagem) {

            mensagem.textContent =
                "Sincronizacao online ativa.";
        }


        const consulta =
            query(

                collection(
                    db,
                    "verificacoes_diarias"
                ),

                orderBy(
                    "criadoEm",
                    "desc"
                )
            );


        onSnapshot(

            consulta,


            function(snapshot) {

                historicoAtual = [];


                snapshot.forEach(
                    function(documento) {

                        historicoAtual.push({
                            id:
                                documento.id,

                            dados:
                                documento.data()
                        });
                    }
                );


                if (
                    painelHistorico &&
                    !painelHistorico
                        .classList
                        .contains(
                            "escondido"
                        )
                ) {

                    mostrarHistorico();
                }
            },


            function(erro) {

                console.error(
                    "ERRO HISTORICO:",
                    erro
                );


                if (mensagem) {

                    mensagem.textContent =
                        "Erro ao sincronizar historico.";
                }
            }
        );


    } catch (erro) {

        console.error(
            "ERRO FIREBASE:",
            erro
        );


        if (mensagem) {

            mensagem.textContent =
                "Firebase nao conectado.";
        }
    }
}


/* =========================================================
   BOTOES
========================================================= */

if (btnFinalizar) {

    btnFinalizar.addEventListener(
        "click",
        function() {

            finalizarFolha();
        }
    );
}


if (btnHistorico) {

    btnHistorico.addEventListener(
        "click",
        function() {

            if (painelHistorico) {

                painelHistorico
                    .classList
                    .remove(
                        "escondido"
                    );
            }


            mostrarHistorico();
        }
    );
}


if (btnFecharHistorico) {

    btnFecharHistorico.addEventListener(
        "click",
        function() {

            if (painelHistorico) {

                painelHistorico
                    .classList
                    .add(
                        "escondido"
                    );
            }
        }
    );
}


/* =========================================================
   INICIAR SISTEMA
========================================================= */

console.log(
    "Iniciando formulario consolidado..."
);


/*
    1. Carregar produtos
*/

carregarListaProdutos();


/*
    2. Preencher data
*/

colocarDataAtual();


/*
    3. Montar linhas conforme a planta
*/

atualizarLinhasDaPlanta();


/*
    4. Conectar Firebase
*/

iniciarFirebase();