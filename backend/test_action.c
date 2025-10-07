#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
    if (argc < 4) {
        printf("Usage: %s <type> <direction> <speed>\n", argv[0]);
        return 1;
    }

    char *type = argv[1];
    char *direction = argv[2];
    int speed = atoi(argv[3]);

    if (strcmp(type, "move") == 0) {
        printf("🚗 Car is moving %s at speed %d\n", direction, speed);
    } 
    else if (strcmp(type, "light") == 0) {
        printf("💡 Car lights %s (speed param = %d)\n", direction, speed);
    } 
    else {
        printf("❌ Invalid type '%s'. Expected 'move' or 'light'.\n", type);
        return 1;
    }

    return 0;
}
