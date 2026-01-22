<<<<<<< HEAD
/**
 * Haptic Feedback Utility
 * Provides tactile feedback on supported devices (mainly mobile)
 */

/**
 * Triggers haptic feedback if supported by the device
 * @param {'light' | 'medium' | 'heavy'} intensity - The intensity of the vibration
 */
export const triggerHaptic = (intensity = 'light') => {
    // Check if the Vibration API is supported
    if (!navigator.vibrate) {
        return;
    }

    // Map intensity to vibration duration (in milliseconds)
    const intensityMap = {
        light: 10,
        medium: 20,
        heavy: 30
    };

    const duration = intensityMap[intensity] || intensityMap.light;

    try {
        navigator.vibrate(duration);
    } catch (error) {
        // Silently fail if vibration is not supported or blocked
        console.debug('Haptic feedback not available:', error);
    }
};

/**
 * Triggers a success haptic pattern
 */
export const hapticSuccess = () => {
    if (navigator.vibrate) {
        navigator.vibrate([10, 50, 10]);
    }
};

/**
 * Triggers an error haptic pattern
 */
export const hapticError = () => {
    if (navigator.vibrate) {
        navigator.vibrate([20, 50, 20, 50, 20]);
    }
};

/**
 * Triggers a warning haptic pattern
 */
export const hapticWarning = () => {
    if (navigator.vibrate) {
        navigator.vibrate([15, 30, 15]);
    }
};

/**
 * React hook for haptic feedback
 * @returns {Object} Haptic feedback functions
 */
export const useHaptic = () => {
    return {
        trigger: triggerHaptic,
        success: hapticSuccess,
        error: hapticError,
        warning: hapticWarning
    };
};
=======
/**
 * Haptic Feedback Utility
 * Provides tactile feedback on supported devices (mainly mobile)
 */

/**
 * Triggers haptic feedback if supported by the device
 * @param {'light' | 'medium' | 'heavy'} intensity - The intensity of the vibration
 */
export const triggerHaptic = (intensity = 'light') => {
    // Check if the Vibration API is supported
    if (!navigator.vibrate) {
        return;
    }

    // Map intensity to vibration duration (in milliseconds)
    const intensityMap = {
        light: 10,
        medium: 20,
        heavy: 30
    };

    const duration = intensityMap[intensity] || intensityMap.light;

    try {
        navigator.vibrate(duration);
    } catch (error) {
        // Silently fail if vibration is not supported or blocked
        console.debug('Haptic feedback not available:', error);
    }
};

/**
 * Triggers a success haptic pattern
 */
export const hapticSuccess = () => {
    if (navigator.vibrate) {
        navigator.vibrate([10, 50, 10]);
    }
};

/**
 * Triggers an error haptic pattern
 */
export const hapticError = () => {
    if (navigator.vibrate) {
        navigator.vibrate([20, 50, 20, 50, 20]);
    }
};

/**
 * Triggers a warning haptic pattern
 */
export const hapticWarning = () => {
    if (navigator.vibrate) {
        navigator.vibrate([15, 30, 15]);
    }
};

/**
 * React hook for haptic feedback
 * @returns {Object} Haptic feedback functions
 */
export const useHaptic = () => {
    return {
        trigger: triggerHaptic,
        success: hapticSuccess,
        error: hapticError,
        warning: hapticWarning
    };
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
