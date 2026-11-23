const {
  ehPalindromo,
  contarVogais,
  calcularFatorial,
  removerDuplicatas,
  agendarConsulta,
  formatarMoeda,
  validarCpfBasico,
  calcularIngresso,
  ContaBancaria,
  obterClima,
} = require('./avancado');

describe('Suíte de Testes Unitários Avançados - Parte 2', () => {
  test('ehPalindromo: valida palavras ignorando maiúsculas', () => {
    expect(ehPalindromo('radar')).toBe(true);
    expect(ehPalindromo('Arara')).toBe(true);
    expect(ehPalindromo('javascript')).toBe(false);
    expect(ehPalindromo('')).toBe(false);
  });

  test('contarVogais: conta vogais acentuadas e retorna 0 sem vogais', () => {
    expect(contarVogais('computador')).toBe(4);
    expect(contarVogais('programação')).toBe(5);
    expect(contarVogais('xyz')).toBe(0);
  });

  test('calcularFatorial: calcula fatoriais e rejeita números negativos', () => {
    expect(calcularFatorial(5)).toBe(120);
    expect(calcularFatorial(0)).toBe(1);
    expect(calcularFatorial(1)).toBe(1);
    expect(() => calcularFatorial(-5)).toThrow('Não existe fatorial de número negativo');
  });

  test('removerDuplicatas: mantém apenas valores únicos na ordem original', () => {
    expect(removerDuplicatas([1, 1, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(removerDuplicatas(['a', 'b', 'a'])).toEqual(['a', 'b']);
  });

  test('agendarConsulta: permite dia útil e bloqueia sábado e domingo', () => {
    const segunda = new Date(2026, 9, 26);
    const sabado = new Date(2026, 9, 24);
    const domingo = new Date(2026, 9, 25);
    expect(agendarConsulta(segunda)).toBe('Consulta agendada com sucesso');
    expect(() => agendarConsulta(sabado)).toThrow('Clínica fechada aos finais de semana');
    expect(() => agendarConsulta(domingo)).toThrow('Clínica fechada aos finais de semana');
  });

  test('formatarMoeda: usa prefixo R$, duas casas e vírgula decimal', () => {
    expect(formatarMoeda(100)).toBe('R$ 100,00');
    expect(formatarMoeda(15.5)).toBe('R$ 15,50');
    expect(() => formatarMoeda('abc')).toThrow('Valor inválido');
  });

  test('validarCpfBasico: valida 11 dígitos e rejeita repetidos', () => {
    expect(validarCpfBasico('12345678901')).toBe(true);
    expect(validarCpfBasico('123.456.789-01')).toBe(true);
    expect(validarCpfBasico('11111111111')).toBe(false);
    expect(validarCpfBasico('12345')).toBe(false);
  });

  test('calcularIngresso: aplica meia-entrada sem acumular descontos', () => {
    expect(calcularIngresso(25, false, 1)).toBe(40);
    expect(calcularIngresso(20, true, 1)).toBe(20);
    expect(calcularIngresso(65, false, 1)).toBe(20);
    expect(calcularIngresso(25, false, 3)).toBe(20);
    expect(calcularIngresso(70, true, 3)).toBe(20);
  });

  describe('ContaBancaria: isolamento com beforeEach', () => {
    let conta;
    beforeEach(() => {
      conta = new ContaBancaria('Felipe Mamprim');
    });

    test('inicia com saldo zero', () => {
      expect(conta.obterSaldo()).toBe(0);
    });
    test('deposita valor positivo e atualiza saldo', () => {
      conta.depositar(150);
      expect(conta.obterSaldo()).toBe(150);
    });
    test('rejeita depósito menor ou igual a zero', () => {
      expect(() => conta.depositar(-50)).toThrow('Valor de depósito deve ser positivo');
      expect(() => conta.depositar(0)).toThrow('Valor de depósito deve ser positivo');
    });
    test('realiza saque quando há saldo suficiente', () => {
      conta.depositar(200);
      conta.sacar(80);
      expect(conta.obterSaldo()).toBe(120);
    });
    test('rejeita saque superior ao saldo', () => {
      conta.depositar(50);
      expect(() => conta.sacar(100)).toThrow('Saldo insuficiente');
    });
  });

  describe('obterClima: mock assíncrono da API', () => {
    test('retorna a temperatura e verifica a chamada do serviço', async () => {
      const servicoMock = {
        buscar: jest.fn().mockResolvedValue({ temperatura: 28 }),
      };
      const resultado = await obterClima('São Paulo', servicoMock);
      expect(resultado).toBe('A temperatura em São Paulo é de 28°C');
      expect(servicoMock.buscar).toHaveBeenCalledWith('São Paulo');
      expect(servicoMock.buscar).toHaveBeenCalledTimes(1);
    });

    test('converte falha do serviço em erro tratado', async () => {
      const servicoMock = {
        buscar: jest.fn().mockRejectedValue(new Error('Network Offline')),
      };
      await expect(obterClima('Curitiba', servicoMock))
        .rejects.toThrow('Falha ao buscar dados climáticos');
    });
  });
});
