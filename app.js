const linhaSelect = document.getElementById("linha");
const verificacoesDiv = document.getElementById("verificacoes");
const tituloLinha = document.getElementById("tituloLinha");
const statusDiv = document.getElementById("status");

const btnFinalizar = document.getElementById("btnFinalizar");
const btnHistorico = document.getElementById("btnHistorico");
const btnFecharHistorico = document.getElementById("btnFecharHistorico");

const painelHistorico = document.getElementById("painelHistorico");
const listaHistorico = document.getElementById("listaHistorico");


const parametrosTubo = [
    "Produto",
    "Comprimento Trim",
    "Comprimento Tubo",
    "Alinhamento da emenda do molde",
    "Marcações a cada 2 metros correta",
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
    "Revisão visual completa",
    "Tubo retilíneo e circular",
    "Inspeção a cada 2 horas",
    "Análise de Negro de Fumo",
    "Fichas corretas"
];


const parametrosG1 = [
    "Material",
    "Tamanho dos Grãos",
    "Furos Internos",
    "Rebarbas nos Grãos",
    "Visual do Bag",
    "Peso do Bag",
    "Etiqueta Correta",
    "Teste de Prensa",
    "RPM",
    "Temperatura",
    "Revisão Visual Completa",
    "Ficha de Dados",
    "Informações Adicionais"
];


const resultados = {
    "3020": {},
    "3660": {},
    "G1": {}
};


function carregarVerificacoes() {

    const linha = linhaSelect.value;

    verificacoesDiv.innerHTML = "";

    let parametros;

    if (linha === "G1") {

        parametros = parametrosG1;

        tituloLinha.textContent = "Verificações - Granulação G1";

    } else {

        parametros = parametrosTubo;

        tituloLinha.textContent = "Verificações - Linha " + linha;
    }


    parametros.forEach(function(parametro, indice) {

        const item = document.createElement("div");

        item.classList.add("item-verificacao");


        const nomeParametro = document.createElement("div");

        nomeParametro.classList.add("nome-parametro");


        const textoParametro = document.createElement("span");

        textoParametro.textContent = parametro;


        nomeParametro.appendChild(textoParametro);


        const opcoes = document.createElement("div");

        opcoes.classList.add("opcoes");


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


        item.appendChild(nomeParametro);

        item.appendChild(opcoes);

        verificacoesDiv.appendChild(item);
    });


    atualizarStatus();
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

    const label = document.createElement("label");

    label.classList.add("opcao");

    label.classList.add(classe);


    const input = document.createElement("input");

    input.type = "radio";

    input.name = "parametro-" + indice;

    input.value = valor;


    if (resultados[linha][parametro] === valor) {

        input.checked = true;
    }


    const span = document.createElement("span");

    span.textContent = texto;


    input.addEventListener("change", function() {

        resultados[linha][parametro] = valor;

        atualizarStatus();
    });


    label.appendChild(input);

    label.appendChild(span);

    local.appendChild(label);
}


function atualizarStatus() {

    const linha = linhaSelect.value;

    let parametros;

    if (linha === "G1") {

        parametros = parametrosG1;

    } else {

        parametros = parametrosTubo;
    }


    const respostas = resultados[linha];

    let existeNaoConforme = false;

    let todosPreenchidos = true;


    parametros.forEach(function(parametro) {

        if (respostas[parametro] === "NC") {

            existeNaoConforme = true;
        }


        if (!respostas[parametro]) {

            todosPreenchidos = false;
        }
    });


    if (existeNaoConforme) {

        statusDiv.textContent = "NÃO CONFORME";

        statusDiv.className = "status nao-conforme";

        return;
    }


    if (todosPreenchidos) {

        statusDiv.textContent = "CONFORME";

        statusDiv.className = "status conforme";

    } else {

        statusDiv.textContent = "PENDENTE";

        statusDiv.className = "status pendente";
    }
}


linhaSelect.addEventListener("change", function() {

    carregarVerificacoes();
});


btnFinalizar.addEventListener("click", function() {

    const nome = document.getElementById("nome").value;

    const data = document.getElementById("data").value;

    const turno = document.getElementById("turno").value;

    const linha = linhaSelect.value;

    const observacao =
        document.getElementById("observacao").value;


    if (nome === "") {

        alert("Selecione o responsável.");

        return;
    }


    if (data === "") {

        alert("Informe a data.");

        return;
    }


    if (turno === "") {

        alert("Selecione o turno.");

        return;
    }


    if (statusDiv.textContent === "PENDENTE") {

        alert(
            "Existem verificações que ainda não foram preenchidas."
        );

        return;
    }


    const agora = new Date();


    const horario =
        agora.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    const registro = {

        nome: nome,

        data: data,

        horario: horario,

        turno: turno,

        linha: linha,

        status: statusDiv.textContent,

        observacao: observacao,

        verificacoes: copiarResultados(
            resultados[linha]
        )
    };


    salvarRegistro(registro);


    alert("Verificação finalizada com sucesso.");
});


function copiarResultados(objeto) {

    const copia = {};


    Object.keys(objeto).forEach(function(chave) {

        copia[chave] = objeto[chave];
    });


    return copia;
}


function salvarRegistro(registro) {

    const historicoSalvo =
        localStorage.getItem(
            "historicoVerificacoes"
        );


    let historico;


    if (historicoSalvo) {

        historico = JSON.parse(historicoSalvo);

    } else {

        historico = [];
    }


    historico.push(registro);


    localStorage.setItem(
        "historicoVerificacoes",
        JSON.stringify(historico)
    );
}


btnHistorico.addEventListener("click", function() {

    painelHistorico.classList.remove("escondido");

    mostrarHistorico();
});


btnFecharHistorico.addEventListener("click", function() {

    painelHistorico.classList.add("escondido");
});


function mostrarHistorico() {

    const historicoSalvo =
        localStorage.getItem(
            "historicoVerificacoes"
        );


    let historico;


    if (historicoSalvo) {

        historico = JSON.parse(historicoSalvo);

    } else {

        historico = [];
    }


    listaHistorico.innerHTML = "";


    if (historico.length === 0) {

        listaHistorico.innerHTML =
            "<p>Nenhuma verificação registrada.</p>";

        return;
    }


    const historicoInvertido =
        historico.slice().reverse();


    historicoInvertido.forEach(
        function(registro) {

            const div =
                document.createElement("div");


            div.classList.add("registro");


            const dataFormatada =
                formatarData(registro.data);


            const linhaData =
                document.createElement("p");

            linhaData.textContent =
                "Data: " + dataFormatada;


            const linhaHora =
                document.createElement("p");

            linhaHora.textContent =
                "Hora: " + registro.horario;


            const linhaResponsavel =
                document.createElement("p");

            linhaResponsavel.textContent =
                "Responsável: " + registro.nome;


            const linhaTurno =
                document.createElement("p");

            linhaTurno.textContent =
                "Turno: " +
                registro.turno +
                "º Turno";


            const linhaMaquina =
                document.createElement("p");

            linhaMaquina.textContent =
                "Linha: " + registro.linha;


            const linhaStatus =
                document.createElement("p");

            linhaStatus.textContent =
                "Status: " + registro.status;


            div.appendChild(linhaData);

            div.appendChild(linhaHora);

            div.appendChild(linhaResponsavel);

            div.appendChild(linhaTurno);

            div.appendChild(linhaMaquina);

            div.appendChild(linhaStatus);


            if (
                registro.observacao &&
                registro.observacao !== ""
            ) {

                const linhaObservacao =
                    document.createElement("p");


                linhaObservacao.textContent =
                    "Observação: " +
                    registro.observacao;


                div.appendChild(
                    linhaObservacao
                );
            }


            listaHistorico.appendChild(div);
        }
    );
}


function formatarData(data) {

    const partes = data.split("-");


    if (partes.length !== 3) {

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


function colocarDataAtual() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");


    const dataAtual =
        ano +
        "-" +
        mes +
        "-" +
        dia;


    document.getElementById("data").value =
        dataAtual;
}


colocarDataAtual();

carregarVerificacoes();
