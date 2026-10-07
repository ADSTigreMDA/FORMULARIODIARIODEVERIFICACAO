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
    "3020": "",
    "3660": ""
};


/* =========================================================
   DADOS ESPECIAIS G1
========================================================= */

const dadosG1 = {
    material: "NSE",
    pesoBag: ""
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
    "3020": {},
    "3660": {},
    "G1": {}
};


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

    if (linha === "G1") {

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
        linha === "3020" ||
        linha === "3660"
    ) {

        if (
            !produtosSelecionados[linha]
        ) {

            completo = false;
        }
    }


    /* Peso do Bag obrigatorio */

    if (linha === "G1") {

        if (
            dadosG1.pesoBag === ""
        ) {

            completo = false;
        }


        if (
            Number(dadosG1.pesoBag) <= 0
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

    const status3020 =
        calcularStatus("3020");

    const status3660 =
        calcularStatus("3660");

    const statusG1 =
        calcularStatus("G1");


    const resumo3020 =
        document.getElementById(
            "resumo3020"
        );

    const resumo3660 =
        document.getElementById(
            "resumo3660"
        );

    const resumoG1 =
        document.getElementById(
            "resumoG1"
        );


    if (resumo3020) {

        resumo3020.textContent =
            status3020;
    }


    if (resumo3660) {

        resumo3660.textContent =
            status3660;
    }


    if (resumoG1) {

        resumoG1.textContent =
            statusG1;
    }


    if (
        statusLinha &&
        linhaSelect
    ) {

        const statusAtual =
            calcularStatus(
                linhaSelect.value
            );


        statusLinha.textContent =
            statusAtual;


        statusLinha.className =
            classeStatus(statusAtual) +
            " status-linha";
    }


    let geral =
        "PENDENTE";


    if (
        status3020 !== "PENDENTE" &&
        status3660 !== "PENDENTE" &&
        statusG1 !== "PENDENTE"
    ) {

        if (
            status3020 === "NAO CONFORME" ||
            status3660 === "NAO CONFORME" ||
            statusG1 === "NAO CONFORME"
        ) {

            geral =
                "NAO CONFORME";

        } else {

            geral =
                "CONFORME";
        }
    }


    if (statusGeral) {

        statusGeral.textContent =
            geral;


        statusGeral.className =
            classeStatus(geral);
    }


    if (btnFinalizar) {

        btnFinalizar.disabled =
            geral === "PENDENTE";
    }
}


/* =========================================================
   C / NC / N/A
========================================================= */

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

    if (linha === "G1") {

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
                dadosG1.pesoBag;
        }


        if (tituloLinha) {

            tituloLinha.textContent =
                "Verificacoes - Granulacao G1";
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


            if (
                linha === "3020" ||
                linha === "3660"
            ) {

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

            dadosG1.pesoBag =
                pesoBag.value;


            atualizarResumo();
        }
    );
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

    const nome =
        document.getElementById(
            "nome"
        );

    const data =
        document.getElementById(
            "data"
        );

    const turno =
        document.getElementById(
            "turno"
        );

    const observacao =
        document.getElementById(
            "observacao"
        );


    return {

        codigoFormulario:
            codigoFormulario,

        revisao:
            revisaoFormulario,

        dataRevisao:
            dataRevisao,


        responsavel:
            nome
                ? nome.value
                : "",


        data:
            data
                ? data.value
                : "",


        turno:
            turno
                ? turno.value
                : "",


        observacao:
            observacao
                ? observacao.value.trim()
                : "",


        statusGeral:
            statusGeral
                ? statusGeral.textContent
                : "PENDENTE",


        linhas: {

            "3020": {

                produto:
                    produtosSelecionados[
                        "3020"
                    ],

                status:
                    calcularStatus(
                        "3020"
                    ),

                verificacoes:
                    Object.assign(
                        {},
                        resultados["3020"]
                    )
            },


            "3660": {

                produto:
                    produtosSelecionados[
                        "3660"
                    ],

                status:
                    calcularStatus(
                        "3660"
                    ),

                verificacoes:
                    Object.assign(
                        {},
                        resultados["3660"]
                    )
            },


            "G1": {

                material:
                    "NSE",

                pesoBagKg:
                    dadosG1.pesoBag,

                status:
                    calcularStatus(
                        "G1"
                    ),

                verificacoes:
                    Object.assign(
                        {},
                        resultados["G1"]
                    )
            }
        }
    };
}


/* =========================================================
   VALIDAR
========================================================= */

function validarFolha() {

    const nome =
        document.getElementById(
            "nome"
        );

    const data =
        document.getElementById(
            "data"
        );

    const turno =
        document.getElementById(
            "turno"
        );


    if (
        !nome ||
        !nome.value
    ) {

        return (
            "Selecione o responsavel."
        );
    }


    if (
        !data ||
        !data.value
    ) {

        return "Informe a data.";
    }


    if (
        !turno ||
        !turno.value
    ) {

        return "Selecione o turno.";
    }


    if (
        !produtosSelecionados[
            "3020"
        ]
    ) {

        return (
            "Selecione o produto da 3020."
        );
    }


    if (
        !produtosSelecionados[
            "3660"
        ]
    ) {

        return (
            "Selecione o produto da 3660."
        );
    }


    if (
        dadosG1.pesoBag === ""
    ) {

        return (
            "Informe o Peso do Bag da G1."
        );
    }


    if (
        Number(dadosG1.pesoBag) <= 0
    ) {

        return (
            "Informe um Peso do Bag valido."
        );
    }


    if (
        !statusGeral ||
        statusGeral.textContent ===
            "PENDENTE"
    ) {

        return (
            "Preencha completamente " +
            "3020, 3660 e G1."
        );
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

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });
    
    
    doc.addImage(
    logo,
    "PNG",
    8,   // posição X
    22,   // posição Y
    30,  // largura
    15  ) // altura

    doc.setFillColor(27,94,32);
    doc.rect(0,0,297,15,"F");

    doc.setTextColor(255,255,255);
    doc.setFontSize(13);
    doc.setFont("helvetica","bold");

    doc.text(
        "LISTA DE VERIFICACAO DIARIA",
        148,
        9,
        {align:"center"}
    );

   doc.setFontSize(8);
doc.setFontSize(6);

doc.setTextColor(
    255,
    255,
    255
);

doc.text(
    codigoFormulario,
    290,
    7,
    { align: "right" }
);

doc.text(
    "REV: " +
    revisaoFormulario,
    290,
    10,
    { align: "right" }
);

doc.text(
    dataRevisao,
    290,
    13,
    { align: "right" }
);

    doc.setTextColor(0,0,0);

    doc.setDrawColor(180);

    doc.rect(10,25,265,18);

    doc.setFontSize(7);

doc.text(
    "Responsavel: " +
    folha.responsavel,
    25,
    38
);

doc.text(
    "Data: " +
    formatarData(folha.data),
    90,
    38
);

doc.text(
    "Turno: " +
    folha.turno,
    150,
    38
);

doc.text(
    "Status: " +
    folha.statusGeral,
    220,
    38
);

doc.setFont("helvetica","bold");


 function imprimirTabela(
        titulo,
        status,
        produto,
        x,
        yInicial,
        parametros,
        verificacoes
    ) {

      doc.setFillColor(
    27,
    115,
    32
);

doc.setTextColor(
    255,
    255,
    255
);

doc.setDrawColor(
    0,
    0,
    0
);

doc.setLineWidth(
    0.8
);

doc.roundedRect(
    x,
    yInicial,
    88,
    6,
    1,
    1,
    "FD"
);


        doc.setFontSize(7);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            titulo +
            " - " +
            status,
            x + 2,
            yInicial + 3.2
        );
        doc.setTextColor(
    0,
    0,
    0
);

        let y = yInicial + 11;

if (produto) {

    doc.setFillColor(
        240,
        240,
        240
    );

doc.setLineWidth(
    0.6
);

doc.rect(
    x,
    y - 3,
    88,
    6,
    "FD"
);

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        produto,
        x + 2,
        y + 1
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    y += 4.5;
}
``
        doc.setFont(
            "helvetica",
            "normal"
        );

        parametros.forEach(
            function(parametro){

                let resultado = "NA";

                const resp =
                    verificacoes[
                        parametro
                    ];

                if (
                    resp === "C"
                ) {

                    resultado = "C";
                }

                if (
                    resp === "NC"
                ) {

                    resultado = "NC";
                }

doc.setLineWidth(
    0.4
);

doc.rect(
    x,
    y - 1.9,
    70,
    5.5
);

doc.rect(
    x + 70,
    y - 1.9,
    18,
    5.5
);

doc.text(
    nomesAbreviados[parametro] ||
    parametro,
    x + 1.5,
    y + 1.7
);

let corTexto = [80, 80, 80];

if (resultado === "C") {

    corTexto = [0, 120, 0];

} else if (resultado === "NC") {

    corTexto = [180, 0, 0];
}

doc.setTextColor(
    corTexto[0],
    corTexto[1],
    corTexto[2]
);

doc.setFont(
    "helvetica",
    "bold"
);

doc.text(
    resultado,
    x + 79,
    y + 1.9,
    {
        align: "center"
    }
);

doc.setTextColor(
    0,
    0,
    0
);

doc.setFont(
    "helvetica",
    "normal"
);

y += 5.5;
            }
        );
    }

 imprimirTabela(
    "LINHA 3020",
    folha.linhas["3020"].status,
    "Produto: " +
    folha.linhas["3020"].produto,
    8,
        50,
        parametrosTubo,
        folha.linhas["3020"].verificacoes
    );
    

imprimirTabela(
    "LINHA 3660",
    folha.linhas["3660"].status,
    "Produto: " +
    folha.linhas["3660"].produto,
    102,
        50,
        parametrosTubo,
        folha.linhas["3660"].verificacoes
    );

imprimirTabela(
    "G1",
    folha.linhas.G1.status,
    "Material NSE | Peso: " +
    folha.linhas.G1.pesoBagKg +
    " kg",
    196,
    50,
    parametrosG1,
    folha.linhas.G1.verificacoes
);       
   

    doc.setFillColor(
        255,
        245,
        180
    );

doc.setLineWidth(
    0.8
);

doc.rect(
    8,
    186,
    281,
    45
);
``
    doc.setFont(
        "helvetica",
        "bold"
    );

/* CABECALHO OBSERVACOES */

doc.setFillColor(
    27,
    105,
    32
);

doc.rect(
    8,
    185,
    281,
    9,
    "F"
);

doc.setTextColor(
    255,
    255,
    255
);

doc.setFont(
    "helvetica",
    "bold"
);

doc.text(
    "OBSERVACOES",
    148,
    189.5,
    {
        align: "center"
    }
);
/* CAIXA */

doc.setTextColor(
    0,
    0,
    0
);

doc.rect(
    8,
    185,
    281,
    42
);

/* LINHAS INTERNAS */

for (
let linha = 200;
linha <= 232;
linha += 6
) {

 doc.setLineWidth(
    0.1
);
doc.rect(10, 25, 265, 18);

doc.line(70, 25, 70, 43);
doc.line(130, 25, 130, 43);
doc.line(190, 25, 190, 43);

doc.line(
12,
linha,
204,
linha
);
}

/* TEXTO */

const linhasObs =
    doc.splitTextToSize(
        folha.observacao || "",
        255
    );

doc.setFont(
    "helvetica",
    "normal"
);

doc.setFontSize(8);

doc.text(
    linhasObs,
    12,
    200

);

    const dataArquivo =
        folha.data
            .split("-")
            .reverse()
            .join("-");

    doc.save(
        "Verificacao_Diaria_" +
        dataArquivo +
        "_Turno_" +
        folha.turno +
        ".pdf"
    );
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
    3. Criar verificacoes 3020
*/

carregarVerificacoes();


/*
    4. Conectar Firebase
*/

iniciarFirebase();