import logging
import os

from flask import Flask
from dotenv import load_dotenv
from sqlalchemy import text

from .models import db


def create_app():
    load_dotenv()
    app = Flask(__name__, static_folder="static", template_folder="templates")
    app.config.from_object("config.Config")

    configure_logging(app)
    db.init_app(app)

    from .routes import main_bp

    app.register_blueprint(main_bp)

    with app.app_context():
        db.create_all()
        try:
            db.session.execute(text("SELECT 1"))
            app.logger.info("Database connectivity check passed.")
        except Exception:
            app.logger.exception("Database connectivity check failed.")

    return app


def configure_logging(app):
    log_level_name = os.getenv("LOG_LEVEL", "INFO").upper()
    log_level = getattr(logging, log_level_name, logging.INFO)
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )
    app.logger.setLevel(log_level)
