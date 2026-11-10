package com.erp.comum.multitenancy;

/**
 * Armazena o identificador da empresa ativa na thread atual da requisição.
 */
public final class TenantContext {

    private static final ThreadLocal<Long> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContext() {
    }

    public static Long getTenantId() {
        return CURRENT_TENANT.get();
    }

    public static void setTenantId(Long tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
