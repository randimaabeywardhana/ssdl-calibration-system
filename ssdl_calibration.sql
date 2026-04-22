-- =============================================
-- SSDL Calibration Management System
-- FINAL 100% OPTIMIZED Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS ssdl_calibration;
USE ssdl_calibration;

-- =============================================
-- 1. User and Role Hierarchy (ISA)
-- =============================================

CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastLogin DATETIME NULL
);

CREATE TABLE Admin (
    userId INT PRIMARY KEY,
    department VARCHAR(100),
    position VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE Staff (
    userId INT PRIMARY KEY,
    employeeId VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE Client (
    userId INT PRIMARY KEY,
    companyName VARCHAR(200) NOT NULL,
    address TEXT,
    contactPerson VARCHAR(150),
    phone VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

-- =============================================
-- 2. Equipment Hierarchy (ISA)
-- =============================================

CREATE TABLE Equipment (
    equipmentId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serialNumber VARCHAR(100) UNIQUE,
    detectorType VARCHAR(100),
    status ENUM('Pending', 'InProgress', 'Calibrated', 'Overdue') DEFAULT 'Pending',
    lastCalibrationDate DATE,
    nextDueDate DATE,
    calibrationIntervalMonths INT,
    instrumentType ENUM('customer', 'reference') NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE CustomerEquipment (
    equipmentId INT PRIMARY KEY,
    clientId INT NOT NULL,
    applicationContext TEXT,
    radiationSources TEXT,
    phantomDetails TEXT,
    FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId) ON DELETE CASCADE,
    FOREIGN KEY (clientId) REFERENCES Client(userId) ON DELETE CASCADE
);

CREATE TABLE ReferenceInstrument (
    equipmentId INT PRIMARY KEY,
    type ENUM('electrometer', 'ion_chamber') NOT NULL,
    cref DECIMAL(15,6),
    cf DECIMAL(15,6),
    certificateNumber VARCHAR(100),
    validUntil DATE,
    FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId) ON DELETE CASCADE
);

-- =============================================
-- 3. Calibration Core
-- =============================================

CREATE TABLE CalibrationType (
    typeId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    defaultTolerancePercent DECIMAL(5,2)
);

CREATE TABLE CalibrationRecord (
    calibrationId INT AUTO_INCREMENT PRIMARY KEY,
    calibrationDate DATE NOT NULL,
    dueDate DATE NOT NULL,
    status ENUM('Draft', 'Completed', 'Approved', 'Rejected') DEFAULT 'Draft',
    notes TEXT,
    equipmentId INT NOT NULL,
    staffId INT NOT NULL,
    electrometerId INT NOT NULL,
    ionChamberId INT NOT NULL,
    calibrationTypeId INT NOT NULL,
    approvedBy INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId),
    FOREIGN KEY (staffId) REFERENCES Staff(userId),
    FOREIGN KEY (electrometerId) REFERENCES ReferenceInstrument(equipmentId),
    FOREIGN KEY (ionChamberId) REFERENCES ReferenceInstrument(equipmentId),
    FOREIGN KEY (calibrationTypeId) REFERENCES CalibrationType(typeId),
    FOREIGN KEY (approvedBy) REFERENCES User(userId)
);

CREATE TABLE CalibrationRange (
    rangeId INT AUTO_INCREMENT PRIMARY KEY,
    calibrationId INT NOT NULL,
    rangeName VARCHAR(50) NOT NULL,
    rangeMin DECIMAL(12,2),
    rangeMax DECIMAL(12,2),
    rangeCalibrationFactor DECIMAL(12,4),
    notes TEXT,
    FOREIGN KEY (calibrationId) REFERENCES CalibrationRecord(calibrationId) ON DELETE CASCADE
);

CREATE TABLE MeasurementPoint (
    pointId INT AUTO_INCREMENT PRIMARY KEY,
    calibrationId INT NOT NULL,
    sourceType ENUM('Cs137', 'Co60', 'Xray') NOT NULL,
    energyKeV DECIMAL(6,2),
    xrayQuality ENUM('Q2', 'Q3', 'Q4', 'Q5', 'Q6') NOT NULL,
    polarity ENUM('+', '-') NOT NULL,
    referenceDoseRate DECIMAL(12,4) NOT NULL,
    temperatureC DECIMAL(5,2),
    pressureKPa DECIMAL(6,2),
    humidityPercent DECIMAL(5,2),
    leakageBefore_pC DECIMAL(12,4),
    leakageAfter_pC DECIMAL(12,4),
    averageLeakageRate_nCps DECIMAL(12,8),
    ktp DECIMAL(8,6),
    avgInstrumentReading DECIMAL(12,4),
    correctedReading DECIMAL(12,4),
    calibrationFactor DECIMAL(12,4),
    errorPercent DECIMAL(8,4),
    uncertaintyCombined DECIMAL(8,4),
    uncertaintyExpanded DECIMAL(8,4),
    orderIndex INT NOT NULL,
    rangeId INT,
    FOREIGN KEY (calibrationId) REFERENCES CalibrationRecord(calibrationId) ON DELETE CASCADE,
    FOREIGN KEY (rangeId) REFERENCES CalibrationRange(rangeId) ON DELETE SET NULL,
    UNIQUE KEY uk_calibration_order (calibrationId, orderIndex)
);

CREATE TABLE Reading (
    readingId INT AUTO_INCREMENT PRIMARY KEY,
    pointId INT NOT NULL,
    value DECIMAL(12,4) NOT NULL,
    originalUnit VARCHAR(20),
    value_uSvh DECIMAL(12,4),
    replicateNumber TINYINT NOT NULL,
    FOREIGN KEY (pointId) REFERENCES MeasurementPoint(pointId) ON DELETE CASCADE,
    CONSTRAINT chk_replicate CHECK (replicateNumber BETWEEN 1 AND 10)
);

-- =============================================
-- 4. Reference System Verification
-- =============================================

CREATE TABLE StabilityTest (
    testId INT AUTO_INCREMENT PRIMARY KEY,
    testDate DATE NOT NULL,
    sourceType VARCHAR(50),
    referenceValue DECIMAL(12,4),
    measuredValue DECIMAL(12,4),
    deviationPercent DECIMAL(8,4),
    status ENUM('Pass', 'Fail'),
    equipmentId INT NOT NULL,
    FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId)
);

CREATE TABLE GammaFieldStandardization (
    stdId INT AUTO_INCREMENT PRIMARY KEY,
    measurementDate DATE NOT NULL,
    distance_m DECIMAL(5,2),
    attenuator_mm INT,
    sourceActivity_GBq DECIMAL(12,4),
    sourceReferenceDate DATE,
    measuredAirKermaRate_mGyh DECIMAL(12,4),
    expectedAirKermaRate_mGyh DECIMAL(12,4),
    deviationPercent DECIMAL(8,4),
    status ENUM('InSpec', 'OutOfSpec'),
    performedBy INT,
    FOREIGN KEY (performedBy) REFERENCES Staff(userId)
);

CREATE TABLE ReferenceSystemVerification (
    verificationId INT AUTO_INCREMENT PRIMARY KEY,
    checkDate DATE NOT NULL,
    overallStatus ENUM('OK', 'Expired', 'DueSoon', 'OutOfTolerance') DEFAULT 'OK',
    validUntil DATETIME,
    stabilityTestId INT,
    gammaFieldStdId INT,
    refInstrumentCalId INT,
    FOREIGN KEY (stabilityTestId) REFERENCES StabilityTest(testId),
    FOREIGN KEY (gammaFieldStdId) REFERENCES GammaFieldStandardization(stdId),
    FOREIGN KEY (refInstrumentCalId) REFERENCES CalibrationRecord(calibrationId)
);

-- =============================================
-- 5. Supporting Tables
-- =============================================

CREATE TABLE UncertaintyComponent (
    compId INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('A', 'B') NOT NULL,
    source VARCHAR(100),
    value DECIMAL(10,6),
    description TEXT,
    pointId INT NOT NULL,
    FOREIGN KEY (pointId) REFERENCES MeasurementPoint(pointId) ON DELETE CASCADE
);

CREATE TABLE Certificate (
    certificateId INT AUTO_INCREMENT PRIMARY KEY,
    certificateNumber VARCHAR(50) UNIQUE NOT NULL,
    issueDate DATE NOT NULL,
    filePath VARCHAR(500),
    calibrationId INT NOT NULL,
    FOREIGN KEY (calibrationId) REFERENCES CalibrationRecord(calibrationId) ON DELETE CASCADE
);

CREATE TABLE PriceList (
    priceId INT AUTO_INCREMENT PRIMARY KEY,
    calibrationTypeId INT NOT NULL,
    instrumentCategory VARCHAR(100),
    basePriceLKR DECIMAL(12,2) NOT NULL,
    taxRate DECIMAL(5,2) DEFAULT 0.00,
    validFrom DATE NOT NULL,
    validTo DATE,
    FOREIGN KEY (calibrationTypeId) REFERENCES CalibrationType(typeId)
);

CREATE TABLE Invoice (
    invoiceId INT AUTO_INCREMENT PRIMARY KEY,
    invoiceNumber VARCHAR(50) UNIQUE NOT NULL,
    issueDate DATE NOT NULL,
    dueDate DATE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    taxAmount DECIMAL(12,2) NOT NULL,
    totalAmount DECIMAL(12,2) NOT NULL,
    paymentStatus ENUM('unpaid', 'paid', 'overdue') DEFAULT 'unpaid',
    paymentDate DATE,
    paymentMethod ENUM('cash', 'cheque', 'bank_transfer'),
    paymentReference VARCHAR(100),
    notes TEXT,
    calibrationId INT NOT NULL,
    clientId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (calibrationId) REFERENCES CalibrationRecord(calibrationId),
    FOREIGN KEY (clientId) REFERENCES Client(userId),
    CHECK (totalAmount = subtotal + taxAmount)
);

CREATE TABLE InvoiceItem (
    itemId INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    invoiceId INT NOT NULL,
    FOREIGN KEY (invoiceId) REFERENCES Invoice(invoiceId) ON DELETE CASCADE
);

CREATE TABLE ServiceRequest (
    requestId INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT NOT NULL,
    equipmentId INT NULL,
    equipmentDetails TEXT NOT NULL,
    urgency ENUM('Routine', 'Urgent') DEFAULT 'Routine',
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    requestedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    adminNotes TEXT,
    FOREIGN KEY (clientId) REFERENCES Client(userId),
    FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId)
);

CREATE TABLE Notification (
    notificationId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    type ENUM('email', 'in_app') NOT NULL,
    subject VARCHAR(255),
    message TEXT,
    isRead BOOLEAN DEFAULT FALSE,
    sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    relatedEntityType ENUM('CalibrationRecord', 'Invoice', 'Certificate', 'ServiceRequest'),
    relatedEntityId INT,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE AuditLog (
    logId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    tableName VARCHAR(100) NOT NULL,
    recordId INT NOT NULL,
    oldValues JSON,
    newValues JSON,
    ipAddress VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- =============================================
-- Performance Indexes
-- =============================================

CREATE INDEX idx_equipment_status ON Equipment(status);
CREATE INDEX idx_calibration_equipment ON CalibrationRecord(equipmentId);
CREATE INDEX idx_measurement_calibration ON MeasurementPoint(calibrationId);
CREATE INDEX idx_reading_point ON Reading(pointId);
CREATE INDEX idx_invoice_client ON Invoice(clientId);
CREATE INDEX idx_notification_user ON Notification(userId);
CREATE INDEX idx_audit_user ON AuditLog(userId);
CREATE INDEX idx_calibration_type_date ON CalibrationRecord(calibrationTypeId, calibrationDate);
CREATE INDEX idx_measurement_range ON MeasurementPoint(rangeId);
CREATE INDEX idx_service_status ON ServiceRequest(status);

-- Additional recommended indexes 
CREATE INDEX idx_customer_equipment_client ON CustomerEquipment(clientId);
CREATE INDEX idx_calibration_due_date ON CalibrationRecord(dueDate);
CREATE INDEX idx_calibration_status ON CalibrationRecord(status);
CREATE INDEX idx_service_client ON ServiceRequest(clientId);
CREATE INDEX idx_invoice_payment_status ON Invoice(paymentStatus);
CREATE INDEX idx_notification_sent_at ON Notification(sentAt);
CREATE INDEX idx_audit_timestamp ON AuditLog(timestamp);
CREATE INDEX idx_pricelist_valid_dates ON PriceList(validFrom, validTo);
CREATE INDEX idx_refsys_valid_until ON ReferenceSystemVerification(validUntil);