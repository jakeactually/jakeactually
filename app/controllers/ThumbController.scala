package controllers

import java.io.File
import javax.inject.Inject

import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * Created by Kevin on 07/07/2017.
  */
class ThumbController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  val root = "public/static"

  def index(image: String) = Action {
    val file = new File(root + image)
    Ok.sendFile(file)
  }

}
