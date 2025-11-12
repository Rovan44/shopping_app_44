# ⚙️ Environment Variables Configuration - COMPLETED

## ✅ What Has Been Configured

### 1. **JAVA_HOME** (Permanent)
- **Variable**: `JAVA_HOME`
- **Value**: `C:\Program Files\Java\jdk-17`
- **Scope**: User Environment Variable
- **Status**: ✅ Set permanently

### 2. **PATH** (Permanent)
- **Added**: `C:\Program Files\Java\jdk-17\bin`
- **Priority**: First in PATH (overrides Java 24)
- **Scope**: User Environment Variable
- **Status**: ✅ Set permanently

---

## 🚀 How to Run Backend (3 Easy Ways)

### **Method 1: Using Batch File** (Simplest - Recommended for CMD)
```cmd
cd C:\Users\infan\Desktop\cape\shopify\backend
start-backend.bat
```

### **Method 2: Using PowerShell Script** (Recommended for PowerShell)
```powershell
cd C:\Users\infan\Desktop\cape\shopify\backend
.\start-backend.ps1
```

### **Method 3: Direct Maven Command** (After Opening New Terminal)
```powershell
cd C:\Users\infan\Desktop\cape\shopify\backend
.\mvnw.cmd spring-boot:run
```

---

## ⚠️ IMPORTANT: Restart Your Terminal

The environment variables are now set **permanently**, but you need to:

1. **Close ALL current PowerShell/CMD windows**
2. **Open a NEW terminal**
3. **Navigate to backend folder**
4. **Run**: `.\mvnw.cmd spring-boot:run`

The new terminal will automatically load JAVA_HOME and PATH!

---

## 🧪 Verify Configuration (in NEW terminal)

```powershell
# Check JAVA_HOME
echo $env:JAVA_HOME
# Should show: C:\Program Files\Java\jdk-17

# Check Java version
java -version
# Should show: java version "17.0.16"

# Check if mvnw works
cd C:\Users\infan\Desktop\cape\shopify\backend
.\mvnw.cmd --version
# Should show: Apache Maven 3.9.9
```

---

## 📁 Startup Scripts Created

### **start-backend.bat** (Windows Batch File)
- For CMD users
- Double-click to run
- Sets JAVA_HOME automatically

### **start-backend.ps1** (PowerShell Script)
- For PowerShell users
- Right-click → "Run with PowerShell"
- Sets JAVA_HOME automatically

Both scripts are located in: `backend/`

---

## 🎯 Quick Start Guide

### **Option A: Double-Click Method**
1. Open File Explorer
2. Navigate to: `C:\Users\infan\Desktop\cape\shopify\backend`
3. Double-click: `start-backend.bat`

### **Option B: Terminal Method**
1. Open **NEW** PowerShell/CMD (important!)
2. Run:
   ```cmd
   cd C:\Users\infan\Desktop\cape\shopify\backend
   .\mvnw.cmd spring-boot:run
   ```

---

## ✅ What You NO LONGER Need to Do

❌ ~~`$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"`~~  
❌ ~~`$env:Path = "C:\Program Files\Java\jdk-17\bin;" + $env:Path`~~  

✅ Just open a new terminal and run: `.\mvnw.cmd spring-boot:run`

---

## 🔧 If It Still Doesn't Work

### Check System Environment Variables Manually:
1. Press `Win + X` → Select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables", verify:
   - `JAVA_HOME = C:\Program Files\Java\jdk-17`
   - `Path` includes: `C:\Program Files\Java\jdk-17\bin`

### Alternative: Use the Startup Scripts
Instead of running mvnw directly, use:
- `start-backend.bat` (always sets environment)
- `start-backend.ps1` (always sets environment)

---

## 📊 System Configuration Summary

| Variable | Value | Scope | Status |
|----------|-------|-------|--------|
| JAVA_HOME | C:\Program Files\Java\jdk-17 | User | ✅ Permanent |
| PATH (Java) | C:\Program Files\Java\jdk-17\bin | User | ✅ Permanent |
| Java Version | 17.0.16 LTS | System | ✅ Active |
| Maven | 3.9.9 (via wrapper) | Project | ✅ Ready |

---

## 🎉 Success Indicator

When you open a **NEW** terminal and type:
```powershell
java -version
```

You should see:
```
java version "17.0.16" 2025-07-15 LTS
Java(TM) SE Runtime Environment (build 17.0.16+12-LTS-247)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.16+12-LTS-247, mixed mode, sharing)
```

**NOT** version 24.0.2 ✅

---

**Status**: ✅ **Environment variables configured permanently!**  
**Next Step**: Close current terminal, open new one, and run backend!
