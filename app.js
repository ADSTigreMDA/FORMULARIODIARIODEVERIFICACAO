/* =========================================================
   CONFIGURACAO DO FIREBASE
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


/* =========================================================
   FIREBASE

   Comeca vazio de proposito.
   O formulario sera carregado ANTES do Firebase.
========================================================= */

let db = null;
let auth = null;

let collectionFirebase = null;
let addDocFirebase = null;
let onSnapshotFirebase = null;
let queryFirebase = null;
let orderByFirebase = null;
let serverTimestampFirebase = null;


/* =========================================================
   IDENTIFICACAO DO FORMULARIO
========================================================= */

const codigoFormulario = "FORM-CQ-028";
const revisaoFormulario = "03";
const dataRevisao = "06/11/2025";


/* =========================================================
   LISTA DE PRODUTOS
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


/* =========================================================
   PRODUTOS SELECIONADOS
========================================================= */

const produtosSelecionados = {
    "3020": "",
    "3660": ""
};


/* =========================================================
   DADOS ESPECIAIS DA G1
========================================================= */

const dadosG1 = {
    material: "NSE",
    pesoBag: ""
};


/* =========================================================
   PARAMETROS 3020 E 3660
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
   PARAMETROS G1

   Material = NSE
   Peso do Bag = campo em kg

   Portanto eles NAO ficam nesta lista.
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
   RESULTADOS
========================================================= */

const resultados = {
    "3020": {},
    "3660": {},
    "G1": {}
};


let historicoAtual = [];


/* =========================================================
   PEGAR ELEMENTOS HTML
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
   VERIFICACAO DE SEGURANCA DO HTML
========================================================= */

function elementoExiste(elemento, nome) {

    if (!elemento) {

        console.warn(
            "Elemento HTML nao encontrado:",
            nome
        );

        return false;
    }

    return true;
}


/* =========================================================
   CARREGAR PRODUTOS

   Essa funcao nao depende do Firebase.
========================================================= */

function carregarListaProdutos() {

    if (
        !elementoExiste(
            produtoSelect,
            "produto"
        )
    ) {
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
   PARAMETROS DA LINHA
========================================================= */

function parametrosDaLinha(linha) {

    if (linha === "G1") {

        return parametrosG1;
    }


    return parametrosTubo;
}


/* =========================================================
   CALCULAR STATUS
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
   CLASSE DO STATUS
========================================================= */

function classeStatus(status) {

    if (
        status === "CONFORME"
    ) {

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
        linhaSelect &&
        statusLinha
    ) {

        const atual =
            calcularStatus(
                linhaSelect.value
            );


        statusLinha.textContent =
            atual;


        statusLinha.className =
            classeStatus(atual) +
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
   CRIAR BOTAO C / NC / NA
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

   Tambem nao depende do Firebase.
========================================================= */

function carregarVerificacoes() {

    if (
        !elementoExiste(
            linhaSelect,
            "linha"
        )
    ) {
        return;
    }


    if (
        !elementoExiste(
            verificacoesDiv,
            "verificacoes"
        )
    ) {
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


    /* 3020 / 3660 */

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
                produtosSelecionados[linha];
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
   DATA ATUAL
========================================================= */

function colocarDataAtual() {

    const campoData =
        document.getElementById("data");


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
   DATA PARA DD/MM/AAAA
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
   TEXTO RESULTADO
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
   EVENTOS

   Todos possuem verificacao para que um elemento ausente
   nao derrube todo o formulario.
========================================================= */

function iniciarEventos() {

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

                    produtosSelecionados[linha] =
                        produtoSelect.value;
                }


                atualizarResumo();
            }
        );
    }


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


    if (linhaSelect) {

        linhaSelect.addEventListener(
            "change",
            function() {

                carregarVerificacoes();
            }
        );
    }


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
}


/* =========================================================
   MONTAR FOLHA COMPLETA
========================================================= */

function montarFolha() {

    const nome =
        document.getElementById("nome");


    const data =
        document.getElementById("data");


    const turno =
        document.getElementById("turno");


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
   VALIDACAO
========================================================= */

function validarFolha() {

    const nome =
        document.getElementById("nome");


    const data =
        document.getElementById("data");


    const turno =
        document.getElementById("turno");


    if (
        !nome ||
        !nome.value
    ) {

        return "Selecione o responsavel.";
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
        !produtosSelecionados["3020"]
    ) {

        return (
            "Selecione o produto da 3020."
        );
    }


    if (
        !produtosSelecionados["3660"]
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
   PDF
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


/* =========================================================
   GERAR PDF
========================================================= */

function gerarPDF(folha) {

    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "Biblioteca de PDF nao carregada."
        );

        return;
    }


    const jsPDF =
        window.jspdf.jsPDF;


    const doc =
        new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });


    let y = 16;


    doc.setFontSize(15);


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "LISTA DE VERIFICACAO DIARIA",
        105,
        y,
        {
            align: "center"
        }
    );


    doc.setFontSize(9);


    doc.text(
        codigoFormulario,
        195,
        10,
        {
            align: "right"
        }
    );


    doc.text(
        "REV: " +
        revisaoFormulario,
        195,
        15,
        {
            align: "right"
        }
    );


    doc.text(
        dataRevisao,
        195,
        20,
        {
            align: "right"
        }
    );


    y += 15;


    y = escreverPDF(
        doc,
        "Responsavel: " +
        folha.responsavel,
        y,
        false
    );


    y = escreverPDF(
        doc,
        "Data da verificacao: " +
        formatarData(
            folha.data
        ),
        y,
        false
    );


    y = escreverPDF(
        doc,
        "Turno: " +
        folha.turno,
        y,
        false
    );


    y = escreverPDF(
        doc,
        "Status geral: " +
        folha.statusGeral,
        y,
        true
    );


    y += 5;


    ["3020", "3660", "G1"]
        .forEach(
            function(linha) {

                y = escreverPDF(
                    doc,
                    "LINHA " +
                    linha +
                    " - " +
                    folha
                        .linhas[linha]
                        .status,
                    y,
                    true
                );


                if (
                    linha === "3020" ||
                    linha === "3660"
                ) {

                    y = escreverPDF(
                        doc,
                        "Produto: " +
                        folha
                            .linhas[linha]
                            .produto,
                        y,
                        true
                    );
                }


                if (
                    linha === "G1"
                ) {

                    y = escreverPDF(
                        doc,
                        "Material: NSE",
                        y,
                        true
                    );


                    y = escreverPDF(
                        doc,
                        "Peso do Bag: " +
                        folha
                            .linhas.G1
                            .pesoBagKg +
                        " kg",
                        y,
                        true
                    );
                }


                const parametros =
                    linha === "G1"
                        ? parametrosG1
                        : parametrosTubo;


                parametros.forEach(
                    function(parametro) {

                        const resposta =
                            folha
                                .linhas[linha]
                                .verificacoes[
                                    parametro
                                ];


                        y = escreverPDF(
                            doc,
                            parametro +
                            ": " +
                            textoResultado(
                                resposta
                            ),
                            y,
                            false
                        );

                    }
                );


                y += 5;
            }
        );


    y = escreverPDF(
        doc,
        "OBSERVACOES",
        y,
        true
    );


    y = escreverPDF(
        doc,
        folha.observacao ||
        "Sem observacoes.",
        y,
        false
    );


    const dataArquivo =
        folha.data
            .split("-")
            .reverse()
            .join("-");


    const nomeArquivo =
        "Verificacao_Diaria_" +
        dataArquivo +
        "_Turno_" +
        folha.turno +
        ".pdf";


    doc.save(
        nomeArquivo
    );
}


/* =========================================================
   FINALIZAR
========================================================= */

async function finalizarFolha() {

    const erro =
        validarFolha();


    if (erro) {

        alert(erro);

        return;
    }


    if (
        !db ||
        !addDocFirebase ||
        !collectionFirebase
    ) {

        alert(
            "Firebase ainda nao esta conectado. " +
            "Aguarde a mensagem de sincronizacao ativa."
        );

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

        await addDocFirebase(

            collectionFirebase(
                db,
                "verificacoes_diarias"
            ),

            Object.assign(
                {},
                folha,
                {

                    criadoEm:
                        serverTimestampFirebase(),

                    uid:
                        auth &&
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


    } catch (
        erroFirebase
    ) {

        console.error(
            "ERRO AO SALVAR:",
            erroFirebase
        );


        if (mensagem) {

            mensagem.textContent =
                "Erro ao salvar no Firebase.";
        }


        alert(
            "Nao foi possivel salvar a folha."
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
                document.createElement("div");


            registro.className =
                "registro";


            const titulo =
                document.createElement("h3");


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
                document.createElement("p");


            responsavel.textContent =
                "Responsavel: " +
                folha.responsavel;


            registro.appendChild(
                responsavel
            );


            const linha3020 =
                document.createElement("p");


            linha3020.textContent =
                "3020 - Produto: " +
                folha.linhas["3020"].produto +
                " - " +
                folha.linhas["3020"].status;


            registro.appendChild(
                linha3020
            );


            const linha3660 =
                document.createElement("p");


            linha3660.textContent =
                "3660 - Produto: " +
                folha.linhas["3660"].produto +
                " - " +
                folha.linhas["3660"].status;


            registro.appendChild(
                linha3660
            );


            const linhaG1 =
                document.createElement("p");


            linhaG1.textContent =
                "G1 - Material NSE - " +
                folha.linhas.G1.pesoBagKg +
                " kg - " +
                folha.linhas.G1.status;


            registro.appendChild(
                linhaG1
            );


            const botaoPDF =
                document.createElement("button");


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
   CONECTAR FIREBASE

   IMPORTANTE:
   Esta funcao roda DEPOIS de criar a interface.
========================================================= */

async function iniciarFirebase() {

    if (mensagem) {

        mensagem.textContent =
            "Conectando ao Firebase...";
    }


    try {

        const firebaseApp =
            await import(
                "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js"
            );


        const firebaseFirestore =
            await import(
                "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"
            );


        const firebaseAuth =
            await import(
                "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js"
            );


        const aplicativoFirebase =
            firebaseApp.initializeApp(
                firebaseConfig
            );


        db =
            firebaseFirestore
                .getFirestore(
                    aplicativoFirebase
                );


        auth =
            firebaseAuth
                .getAuth(
                    aplicativoFirebase
                );


        collectionFirebase =
            firebaseFirestore.collection;


        addDocFirebase =
            firebaseFirestore.addDoc;


        onSnapshotFirebase =
            firebaseFirestore.onSnapshot;


        queryFirebase =
            firebaseFirestore.query;


        orderByFirebase =
            firebaseFirestore.orderBy;


        serverTimestampFirebase =
            firebaseFirestore.serverTimestamp;


        await firebaseAuth
            .signInAnonymously(
                auth
            );


        if (mensagem) {

            mensagem.textContent =
                "Sincronizacao online ativa.";
        }


        iniciarHistoricoFirebase();


    } catch (erro) {

        console.error(
            "ERRO FIREBASE:",
            erro
        );


        if (mensagem) {

            mensagem.textContent =
                "Formulario ativo. Firebase desconectado.";
        }
    }
}


/* =========================================================
   SINCRONIZAR HISTORICO
========================================================= */

function iniciarHistoricoFirebase() {

    if (
        !db ||
        !collectionFirebase ||
        !queryFirebase ||
        !orderByFirebase ||
        !onSnapshotFirebase
    ) {

        return;
    }


    const consulta =
        queryFirebase(

            collectionFirebase(
                db,
                "verificacoes_diarias"
            ),

            orderByFirebase(
                "criadoEm",
                "desc"
            )

        );


    onSnapshotFirebase(

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
                    "Sincronizacao ativa, mas ocorreu erro no historico.";
            }

        }

    );
}


/* =========================================================
   INICIALIZACAO

   A ORDEM ABAIXO E IMPORTANTE.
========================================================= */

console.log(
    "Iniciando formulario..."
);


/*
   1. Primeiro cria os produtos.
*/

carregarListaProdutos();


/*
   2. Depois coloca a data.
*/

colocarDataAtual();


/*
   3. Depois cria as verificacoes.
*/

carregarVerificacoes();


/*
   4. Somente depois registra os eventos.
*/

iniciarEventos();


/*
   5. Firebase e a ultima etapa.
*/

iniciarFirebase();
