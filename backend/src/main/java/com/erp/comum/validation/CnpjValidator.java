package com.erp.comum.validation;

public final class CnpjValidator {

    private CnpjValidator() {
    }

    /**
     * Valida um número de CNPJ calculando os dois dígitos verificadores.
     * Aceita CNPJ formatado ou apenas dígitos.
     */
    public static boolean isValido(String cnpj) {
        if (cnpj == null) return false;

        String digits = cnpj.replaceAll("\\D", "");

        if (digits.length() != 14) return false;

        // Rejeita sequências de dígitos iguais conhecidas (00000000000000, 11111111111111, etc.)
        if (digits.matches("(\\d)\\1{13}")) return false;

        try {
            int digito1 = calcularDigito(digits.substring(0, 12), new int[]{5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2});
            int digito2 = calcularDigito(digits.substring(0, 12) + digito1, new int[]{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2});

            return digits.equals(digits.substring(0, 12) + digito1 + digito2);
        } catch (Exception e) {
            return false;
        }
    }

    private static int calcularDigito(String str, int[] peso) {
        int soma = 0;
        for (int i = str.length() - 1, digito; i >= 0; i--) {
            digito = Character.getNumericValue(str.charAt(i));
            soma += digito * peso[peso.length - str.length() + i];
        }
        soma = 11 - (soma % 11);
        return soma > 9 ? 0 : soma;
    }
}
