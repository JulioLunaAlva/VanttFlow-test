import re

file_path = 'src/context/FinanceContext.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix early return
bad_early_return = """    if (!isDbReady) {
        return <div className="flex items-center justify-center h-screen w-screen bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }"""
content = content.replace(bad_early_return, "")

# Move it to the bottom where Provider is returned
old_return = """    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );"""

new_return = """    return (
        <FinanceContext.Provider value={value}>
            {!isDbReady ? (
                <div className="flex items-center justify-center h-screen w-screen bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                children
            )}
        </FinanceContext.Provider>
    );"""
content = content.replace(old_return, new_return)

# 2. Fix setPaymentInstances
content = re.sub(r'setPaymentInstances\(prev => \[\s*\.\.\.prev,\s*(\{.*?\})\s*\]\);', r'db.paymentInstances.add(\1);', content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed FinanceContext.")
