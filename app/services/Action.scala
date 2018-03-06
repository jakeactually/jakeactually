package services

import javax.inject.Inject

import pdi.jwt.JwtSession._
import play.api.libs.json._
import play.api.mvc._
import play.api.mvc.Results.Unauthorized

import scala.concurrent.{ExecutionContext, Future}

/**
  * Created by Kevin on 02/05/2017.
  */
object Action {
  class AdminAction @Inject()(val parser: BodyParsers.Default)(implicit val executionContext: ExecutionContext)
    extends ActionBuilder[Request, AnyContent] with ActionFilter[Request] {

    def filter[A](request: Request[A]) = Future.successful {
      request.jwtSession.get("auth") match {
        case Some(JsBoolean(true)) => None
        case _ => Some(Unauthorized)
      }
    }
  }
}
