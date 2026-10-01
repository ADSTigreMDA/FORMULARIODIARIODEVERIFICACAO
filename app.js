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


/* =====================================================
   FIREBASE
===================================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyAxCsnznNdkxgG1Z8139mxVQovmvQwTj_o",

    authDomain:
        "formulario-verificacao-diaria.firebaseapp.com",

    projectId:
        "formulario-verificacao-diaria",

    storageBucket:
        "formulario-verificacao-diaria.firebasestorage.app",

    messagingSenderId:
        "92344286973",

    appId:
        "1:92344286973:web:67ab3f7011be3ec8e84894",

    measurementId:
        "G-2LXSN1B5TS"
};


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


const auth =
    getAuth(app);


/* =====================================================
   PRODUTOS 3020 E 3660
===================================================== */

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


/* =====================================================
   PRODUTO SELECIONADO POR LINHA
===================================================== */

const produtosSelecionados = {

    "3020": "",

    "3660": ""

};


/* =====================================================
   PARAMETROS 3020 E 3660

   PRODUTO NAO ESTA AQUI.
   PRODUTO AGORA E UMA LISTA.
===================================================== */

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

    "EP correta",

    "Die Lines",

    "Die Line Pitting",

    "Aspecto visual",

    "Revisao visual completa",

    "Tubo retilineo e circular",

    "Inspecao a cada 2 horas",

    "Analise de Negro de Fumo",

    "Fichas corretas"

];


/* =====================================================
   PARAMETROS G1
===================================================== */

const parametrosG1 = [

    "Material",

    "Tamanho dos Graos",

    "Furos Internos",

    "Rebarbas nos Graos",

    "Visual do Bag",

    "Peso do Bag",

    "Etiqueta correta",

    "Teste de Prensa",

    "RPM",

    "Temperatura",

    "Revisao visual completa",

    "Ficha de Dados",

    "Informacoes adicionais"

];


/* =====================================================
   RESULTADOS
===================================================== */

const resultados = {

    "3020": {},

    "3660": {},

    "G1": {}

};


let historicoAtual = [];


/* =====================================================
   ELEMENTOS
===================================================== */

const linhaSelect =
    document.getElementById("linha");


const produtoSelect =
    document.getElementById("produto");


const areaProduto =
    document.getElementById("areaProduto");


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
    document.getElementById(
        "btnFecharHistorico"
    );


const painelHistorico =
    document.getElementById(
        "painelHistorico"
    );


const listaHistorico =
    document.getElementById(
        "listaHistorico"
    );


const mensagem =
    document.getElementById("mensagem");


/* =====================================================
   CARREGAR LISTA DE PRODUTOS
===================================================== */

function carregarListaProdutos() {

    produtoSelect.innerHTML = "";


    const opcaoInicial =
        document.createElement("option");


    opcaoInicial.value = "";

    opcaoInicial.textContent =
        "Selecione o produto";


    produtoSelect.appendChild(
        opcaoInicial
    );


    produtos.forEach(
        function(produto) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                produto;


            option.textContent =
                produto;


            produtoSelect.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   PARAMETROS DA LINHA
===================================================== */

function parametrosDaLinha(linha) {

    if (linha === "G1") {

        return parametrosG1;

    }


    return parametrosTubo;

}


/* =====================================================
   STATUS DA LINHA
===================================================== */

function calcularStatus(linha) {

    const parametros =
        parametrosDaLinha(linha);


    const respostas =
        resultados[linha];


    let completo =
        true;


    let naoConforme =
        false;


    /*
        3020 e 3660 precisam
        ter produto selecionado.
    */

    if (
        linha !== "G1" &&
        !produtosSelecionados[linha]
    ) {

        completo =
            false;

    }


    parametros.forEach(
        function(parametro) {

            if (
                !respostas[parametro]
            ) {

                completo =
                    false;

            }


            if (
                respostas[parametro] ===
                "NC"
            ) {

                naoConforme =
                    true;

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


/* =====================================================
   CLASSE DO STATUS
===================================================== */

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


/* =====================================================
   ATUALIZAR RESUMO
===================================================== */

function atualizarResumo() {

    const status3020 =
        calcularStatus("3020");


    const status3660 =
        calcularStatus("3660");


    const statusG1 =
        calcularStatus("G1");


    document
        .getElementById("resumo3020")
        .textContent =
        status3020;


    document
        .getElementById("resumo3660")
        .textContent =
        status3660;


    document
        .getElementById("resumoG1")
        .textContent =
        statusG1;


    const atual =
        calcularStatus(
            linhaSelect.value
        );


    statusLinha.textContent =
        atual;


    statusLinha.className =
        classeStatus(atual) +
        " status-linha";


    let geral =
        "PENDENTE";


    if (
        status3020 !== "PENDENTE" &&
        status3660 !== "PENDENTE" &&
        statusG1 !== "PENDENTE"
    ) {

        if (
            status3020 ===
                "NAO CONFORME" ||
            status3660 ===
                "NAO CONFORME" ||
            statusG1 ===
                "NAO CONFORME"
        ) {

            geral =
                "NAO CONFORME";

        } else {

            geral =
                "CONFORME";

        }

    }


    statusGeral.textContent =
        geral;


    statusGeral.className =
        classeStatus(geral);


    btnFinalizar.disabled =
        geral === "PENDENTE";

}


/* =====================================================
   CRIAR OPCAO
===================================================== */

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
        document.createElement(
            "label"
        );


    label.className =
        "opcao " +
        classe;


    const input =
        document.createElement(
            "input"
        );


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

        input.checked =
            true;

    }


    const span =
        document.createElement(
            "span"
        );


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


    label.appendChild(
        input
    );


    label.appendChild(
        span
    );


    local.appendChild(
        label
    );

}


/* =====================================================
   CARREGAR VERIFICACOES
===================================================== */

function carregarVerificacoes() {

    const linha =
        linhaSelect.value;


    const parametros =
        parametrosDaLinha(
            linha
        );


    verificacoesDiv.innerHTML =
        "";


    /*
        PRODUTO APARECE SOMENTE
        PARA 3020 E 3660
    */

    if (linha === "G1") {

        areaProduto.style.display =
            "none";


        tituloLinha.textContent =
            "Verificacoes - Granulacao G1";

    } else {

        areaProduto.style.display =
            "block";


        produtoSelect.value =
            produtosSelecionados[linha];


        tituloLinha.textContent =
            "Verificacoes - Linha " +
            linha;

    }


    parametros.forEach(
        function(
            parametro,
            indice
        ) {


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "item-verificacao";


            const nome =
                document.createElement(
                    "div"
                );


            nome.className =
                "nome-parametro";


            const texto =
                document.createElement(
                    "span"
                );


            texto.textContent =
                parametro;


            nome.appendChild(
                texto
            );


            const opcoes =
                document.createElement(
                    "div"
                );


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


    atualizarResumo();

}


/* =====================================================
   PRODUTO ALTERADO
===================================================== */

produtoSelect.addEventListener(
    "change",
    function() {

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


/* =====================================================
   TROCAR LINHA
===================================================== */

linhaSelect.addEventListener(
    "change",
    function() {

        carregarVerificacoes();

    }
);


/* =====================================================
   DATA ATUAL
===================================================== */

function colocarDataAtual() {

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


    document
        .getElementById("data")
        .value =
        ano +
        "-" +
        mes +
        "-" +
        dia;

}


/* =====================================================
   DATA BRASILEIRA
===================================================== */

function formatarData(data) {

    const partes =
        String(data).split("-");


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


/* =====================================================
   TRADUZIR RESPOSTA
===================================================== */

function textoResultado(valor) {

    if (
        valor === "C"
    ) {

        return "Conforme";

    }


    if (
        valor === "NC"
    ) {

        return "Nao Conforme";

    }


    if (
        valor === "NA"
    ) {

        return "N/A";

    }


    return "Pendente";

}


/* =====================================================
   MONTAR FOLHA COMPLETA
===================================================== */

function montarFolha() {

    return {

        responsavel:
            document
                .getElementById("nome")
                .value,


        data:
            document
                .getElementById("data")
                .value,


        turno:
            document
                .getElementById("turno")
                .value,


        observacao:
            document
                .getElementById(
                    "observacao"
                )
                .value
                .trim(),


        statusGeral:
            statusGeral
                .textContent,


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
                        resultados[
                            "3020"
                        ]
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
                        resultados[
                            "3660"
                        ]
                    )

            },


            "G1": {

                status:
                    calcularStatus(
                        "G1"
                    ),

                verificacoes:
                    Object.assign(
                        {},
                        resultados[
                            "G1"
                        ]
                    )

            }

        }

    };

}


/* =====================================================
   VALIDAR
===================================================== */

function validarFolha() {

    const nome =
        document
            .getElementById("nome")
            .value;


    const data =
        document
            .getElementById("data")
            .value;


    const turno =
        document
            .getElementById("turno")
            .value;


    if (!nome) {

        return (
            "Selecione o responsavel."
        );

    }


    if (!data) {

        return (
            "Informe a data."
        );

    }


    if (!turno) {

        return (
            "Selecione o turno."
        );

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


/* =====================================================
   ESCREVER NO PDF
===================================================== */

function escreverPDF(
    doc,
    texto,
    y,
    negrito
) {

    if (
        y > 275
    ) {

        doc.addPage();

        y = 18;

    }


    if (negrito) {

        doc.setFont(
            "helvetica",
            "bold"
        );

    } else {

        doc.setFont(
            "helvetica",
            "normal"
        );

    }


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


/* =====================================================
   GERAR PDF
===================================================== */

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

            orientation:
                "portrait",

            unit:
                "mm",

            format:
                "a4"

        });


    let y =
        18;


    doc.setFontSize(
        16
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "LISTA DE VERIFICACAO DIARIA",
        105,
        y,
        {
            align:
                "center"
        }
    );


    y += 10;


    doc.setFontSize(
        10
    );


    y = escreverPDF(
        doc,
        "Responsavel: " +
        folha.responsavel,
        y,
        false
    );


    y = escreverPDF(
        doc,
        "Data: " +
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


    y += 6;


    const linhasFolha = [
        "3020",
        "3660",
        "G1"
    ];


    linhasFolha.forEach(
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
                linha !== "G1"
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


            const parametros =
                linha === "G1"
                    ? parametrosG1
                    : parametrosTubo;


            parametros.forEach(
                function(parametro) {


                    const resposta =
                        folha
                            .linhas[
                                linha
                            ]
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


/* =====================================================
   FINALIZAR
===================================================== */

async function finalizarFolha() {

    const erro =
        validarFolha();


    if (erro) {

        alert(
            erro
        );

        return;

    }


    const folha =
        montarFolha();


    btnFinalizar.disabled =
        true;


    mensagem.textContent =
        "Salvando online...";


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


        mensagem.textContent =
            "Salvo online. Gerando PDF...";


        gerarPDF(
            folha
        );


        mensagem.textContent =
            "Folha salva e PDF gerado.";


    } catch (erroFirebase) {


        console.error(
            erroFirebase
        );


        mensagem.textContent =
            "Erro ao salvar no Firebase.";


        alert(
            "Nao foi possivel salvar a folha."
        );

    }


    atualizarResumo();

}


/* =====================================================
   HISTORICO
===================================================== */

function mostrarHistorico() {

    listaHistorico.innerHTML =
        "";


    if (
        historicoAtual.length === 0
    ) {

        const vazio =
            document.createElement(
                "p"
            );


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


            const produto3020 =
                document.createElement(
                    "p"
                );


            produto3020.textContent =
                "3020 - Produto: " +
                folha
                    .linhas[
                        "3020"
                    ]
                    .produto;


            registro.appendChild(
                produto3020
            );


            const produto3660 =
                document.createElement(
                    "p"
                );


            produto3660.textContent =
                "3660 - Produto: " +
                folha
                    .linhas[
                        "3660"
                    ]
                    .produto;


            registro.appendChild(
                produto3660
            );


            const status =
                document.createElement(
                    "p"
                );


            status.textContent =
                "Status geral: " +
                folha.statusGeral;


            registro.appendChild(
                status
            );


            const pdf =
                document.createElement(
                    "button"
                );


            pdf.className =
                "btn primario";


            pdf.textContent =
                "Baixar PDF";


            pdf.addEventListener(
                "click",
                function() {

                    gerarPDF(
                        folha
                    );

                }
            );


            registro.appendChild(
                pdf
            );


            listaHistorico.appendChild(
                registro
            );

        }
    );

}


/* =====================================================
   FIREBASE
===================================================== */

async function iniciarFirebase() {

    try {


        await signInAnonymously(
            auth
        );


        mensagem.textContent =
            "Sincronizacao online ativa.";


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


                historicoAtual =
                    [];


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
                    erro
                );


                mensagem.textContent =
                    "Erro ao sincronizar historico.";


            }

        );


    } catch (erro) {


        console.error(
            erro
        );


        mensagem.textContent =
            "Firebase nao conectado.";

    }

}


/* =====================================================
   BOTOES
===================================================== */

btnFinalizar.addEventListener(
    "click",
    function() {

        finalizarFolha();

    }
);


btnHistorico.addEventListener(
    "click",
    function() {

        painelHistorico
            .classList
            .remove(
                "escondido"
            );


        mostrarHistorico();

    }
);


btnFecharHistorico.addEventListener(
    "click",
    function() {

        painelHistorico
            .classList
            .add(
                "escondido"
            );

    }
);


/* =====================================================
   INICIAR SISTEMA
===================================================== */

carregarListaProdutos();

colocarDataAtual();

carregarVerificacoes();

iniciarFirebase();
