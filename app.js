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
    "FORM-CQ-028";

const revisaoFormulario =
    "03";

const dataRevisao =
    "06/11/2025";


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


            texto.textContent =
                parametro;


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

    doc.setFillColor(0,70,127);
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

   doc.setFontSize(5);

    doc.text(
        codigoFormulario +
        " | REV " +
        revisaoFormulario +
        " | " +
        dataRevisao,
        148,
        13,
        {align:"center"}
    );

    doc.setTextColor(0,0,0);

    doc.setDrawColor(180);

    doc.rect(10,20,277,18);

    doc.setFontSize(7);

    doc.text(
        "Responsavel: " +
        folha.responsavel,
        15,
        26
    );

    doc.text(
        "Data: " +
        formatarData(folha.data),
        15,
        31
    );

    doc.text(
        "Turno: " +
        folha.turno,
        15,
        36
    );

    doc.text(
        "Status: " +
        folha.statusGeral,
        80,
        26
    );

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
    0,
    70,
    127
);

doc.setTextColor(
    255,
    255,
    255
);


     doc.roundedRect(
    x,
    yInicial,
    64,
    5,
    1,
    1,
    "F"
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

            doc.text(
                produto,
                x + 2,
                y
            );

            y += 5;
        }

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

doc.rect(
    x,
    y - 2,
    55,
    5.0
);

doc.rect(
    x + 55,
    y - 2,
    8,
    4.2
);
``

doc.text(
    nomesAbreviados[
        parametro
    ] ||
    parametro,
    x + 1,
    y + 0.8
);

if (resultado === "NC") {

    doc.setFillColor(255,180,180);

    doc.rect(
        x + 55,
        y - 2,
        8,
        3.5,
        "F"
    );

    doc.setTextColor(
        180,
        0,
        0
    );

}
else if (resultado === "C") {

    doc.setFillColor(180,255,180);

    doc.rect(
        x + 55,
        y - 2,
        8,
        3.5,
        "F"
    );

    doc.setTextColor(
        0,
        120,
        0
    );

}
else {

    doc.setFillColor(220,220,220);

    doc.rect(
        x + 55,
        y - 2,
        8,
        3.5,
        "F"
    );

    doc.setTextColor(
        80,
        80,
        80
    );
}

doc.text(
    resultado,
    x + 57,
    y
);

doc.setTextColor(
    0,
    0,
    0
);
y += 4.2;
            }
        );
    }

 imprimirTabela(
    "LINHA 3020",
    folha.linhas["3020"].status,
    "Produto: " +
    folha.linhas["3020"].produto,
    10,
        60,
        parametrosTubo,
        folha.linhas["3020"].verificacoes
    );

imprimirTabela(
    "LINHA 3660",
    folha.linhas["3660"].status,
    "Produto: " +
    folha.linhas["3660"].produto,
    105,
        60,
        parametrosTubo,
        folha.linhas["3660"].verificacoes
    );

imprimirTabela(
    "G1",
    folha.linhas.G1.status,
    "Material NSE | Peso: " +
    folha.linhas.G1.pesoBagKg +
    " kg",
    195,
    60,
    parametrosG1,
    folha.linhas.G1.verificacoes
);       
   

    doc.setFillColor(
        255,
        245,
        180
    );

    doc.rect(
        10,
        240,
        277,
        7,
        "F"
    );

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        "OBSERVACOES",
        12,
        180
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        folha.observacao ||
        "Sem observacoes.",
        12,
        190
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