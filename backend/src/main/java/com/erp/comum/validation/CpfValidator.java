package com.erp.comum.validation;

public final class CpfValidator {

    private CpfValidator() {
        // Classe utilitária
    }

    public static boolean isValid(String cpf) {
        return isValido(cpf);
    }

    public static boolean isValido(String cpf) {
        if (cpf == null) {
            return false;
        }

        // Remove caracteres não numéricos
        String digitos = cpf.replaceAll("\\D", "");

        if (digitos.length() != 11) {
            return false;
        }

        // Rejeita padrões conhecidos com todos os dígitos iguais (ex: 00000000000, 11111111111)
        if (digitos.matches("(\\d)\\1{10}")) {
            return false;
        }

        try {
            // Cálculo do primeiro dígito verificador
            int soma = 0;
            for (int i = 0; i < 9; i++) {
                soma += (digitos.charAt(i) - '0') * (10 - i);
            }
            int resto = soma % 11;
            int primeiroDigitoVerificador = (resto < 2) ? 0 : (11 - resto);

            if ((digitos.charAt(9) - '0') != primeiroDigitoVerificador) {
                return false;
            }

            // Cálculo do segundo dígito verificador
            soma = 0;
            for (int i = 0; i < 10; i++) {
                soma += (digitos.charAt(i) - '0') * (11 - i);
            }
            resto = soma % 11;
            int segundoDigitoVerificador = (resto < 2) ? 0 : (11 - resto);

            return (digitos.charAt(10) - '0') == segundoDigitoVerificador;
        } catch (Exception e) {
            return false;
        }
    }
}
