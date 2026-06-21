from django.apps import AppConfig

class DiagnosticsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'diagnostics'

    def ready(self):
        # This line "wakes up" your signals file
        import diagnostics.signals