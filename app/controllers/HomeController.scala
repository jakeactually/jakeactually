package controllers

import javax.inject._

import pdi.jwt.JwtSession
import play.api._
import play.api.mvc._

@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def jwt() = Action { implicit request: Request[AnyContent] =>
    val session = JwtSession() + ("auth", true)
    Ok(session.serialize)
  }
}
