import re

with open("src/i18n.js", "r", encoding="utf-8") as f:
    content = f.read()

# For 'accounts', inject missing keys before '            },'
accounts_keys_es = """                installments: "Parcialidades",
                fortnightly: "Quincenal",
                monthly: "Mensual",
                total_assets: "Activos",
                total_debts: "Pasivos",
                proportion: "{{percent}}% del total",
                account_name: "Nombre de Cuenta",
                account_type: "Tipo de Cuenta",
                add_new: "Agregar Cuenta",
                available_balance: "Saldo Disponible",
                cash_option: "Efectivo",
                confirm_delete: "¿Estás seguro de eliminar esta cuenta?",
                credit_option: "Tarjeta de Crédito",
                current_balance: "Saldo Actual",
                debit_option: "Cuenta de Débito",
                delete_desc: "Esta acción no se puede deshacer.",
                distinctive_color: "Color Distintivo",
                edit_desc: "Modifica los detalles de tu cuenta",
                initial_debt: "Deuda Inicial",
                investment_option: "Inversión",
                manage: "Gestionar Cuentas",
                manage_subtitle: "Administra tus cuentas, tarjetas y efectivo",
                payment_day: "Día de Pago"
"""

accounts_keys_en = """                    installments: "Installments",
                    fortnightly: "Biweekly",
                    monthly: "Monthly",
                    total_assets: "Assets",
                    total_debts: "Liabilities",
                    proportion: "{{percent}}% of total",
                    account_name: "Account Name",
                    account_type: "Account Type",
                    add_new: "Add New",
                    available_balance: "Available Balance",
                    cash_option: "Cash",
                    confirm_delete: "Are you sure you want to delete this account?",
                    credit_option: "Credit Card",
                    current_balance: "Current Balance",
                    debit_option: "Debit Account",
                    delete_desc: "This action cannot be undone.",
                    distinctive_color: "Distinctive Color",
                    edit_desc: "Modify your account details",
                    initial_debt: "Initial Debt",
                    investment_option: "Investment",
                    manage: "Manage Accounts",
                    manage_subtitle: "Manage your accounts, cards, and cash",
                    payment_day: "Payment Day"
"""

notes_es = """            notes: {
                title: "Cuaderno",
                they_owe: "Me deben",
                i_owe: "Yo debo",
                net_balance: "Saldo Neto",
                filter_all: "Todas",
                filter_pending: "Pendientes",
                filter_settled: "Saldadas"
            },
"""

notes_en = """                notes: {
                    title: "Notebook",
                    they_owe: "They owe me",
                    i_owe: "I owe",
                    net_balance: "Net Balance",
                    filter_all: "All",
                    filter_pending: "Pending",
                    filter_settled: "Settled"
                },
"""

# Find es accounts end
content = content.replace('proportion: "{{percent}}% del total"\\n            },', accounts_keys_es + '            },\\n' + notes_es)

# Find en accounts end
content = content.replace('no_debit_accounts_desc: "Add your initial cash or payroll accounts."\\n                },', 'no_debit_accounts_desc: "Add your initial cash or payroll accounts.",\\n' + accounts_keys_en + '                },\\n' + notes_en)

# Add accounts to common
content = content.replace('cards: "Cuentas",\\n                subscriptions: "Suscripciones",', 'cards: "Tarjetas",\\n                accounts: "Cuentas",\\n                subscriptions: "Suscripciones",')
content = content.replace('cards: "Cards",\\n                    subscriptions: "Subscriptions",', 'cards: "Cards",\\n                    accounts: "Accounts",\\n                    subscriptions: "Subscriptions",')

with open("src/i18n.js", "w", encoding="utf-8") as f:
    f.write(content)
