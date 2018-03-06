package controllers

import java.io.File
import javax.inject.Inject

import play.api.libs.json.Json
import play.api.mvc._
import services.Action.AdminAction

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * Created by Kevin on 07/07/2017.
  */
class FileController @Inject()(cc: ControllerComponents, adminAction: AdminAction) extends AbstractController(cc) {

  val root = "public/static"

  def ls(dir: String) = adminAction {
    val files = new File(root + dir).listFiles
    val jsonFiles = files map { x => Json.obj("name" -> x.getName, "isDir" -> x.isDirectory) }
    val json = Json.toJson(jsonFiles)
    Ok(json)
  }

  def upload = adminAction(parse.multipartFormData) { request =>
    val dir = request.body.dataParts("dir").head
    val file = request.body.file("file").get
    val dst = new File(root + dir + file.filename)
    file.ref.moveTo(dst.getNextAvailable)
    Ok("null")
  }

  def newDir = adminAction(parse.formUrlEncoded) { request =>
    val dir = request.body("dir").head
    val newDir = request.body("newDir").head
    new File(root + dir + newDir).getNextAvailable.mkdir()
    Ok("null")
  }

  def download(file: String) = Action {
    val file_ = new File(root + file)
    Ok.sendFile(file_)
  }

  def rename = adminAction(parse.formUrlEncoded) { request =>
    val dir = request.body("dir").head
    val oldFile = new File(root + dir + request.body("oldName").head)
    val newFile = new File(root + dir + request.body("newName").head)
    oldFile.renameTo(newFile.getNextAvailable)
    Ok("null")
  }

  def delete = adminAction(parse.formUrlEncoded) { request =>
    val dir = request.body("dir").head
    val files = request.body("files").head.split(",")
    files foreach { x => new File(root + dir + x).deleteRec() }
    Ok("null")
  }

  def move = adminAction(parse.formUrlEncoded) { request =>
    val oldDir = request.body("srcDir").head
    val files = request.body("files").head.split(",")
    val newDir = request.body("dstDir").head
    files foreach { x =>
      val oldFile = new File(root + oldDir + x)
      val newFile = new File(root + newDir + x)
      oldFile.renameTo(newFile.getNextAvailable)
    }
    Ok("null")
  }

  implicit class FileUtil(file: File) {
    def getNextAvailable: File = {
      if (file.exists) {
        val index = file.getName.lastIndexOf('.')
        val (name, ext) = if (index != -1) file.getName.splitAt(index) else (file.getName, "")
        var acc = 1
        while (new File(file.getParent + "/" + name + acc.toString + ext).exists) {
          acc += 1
        }
        new File(file.getParent + "/" + name + acc.toString + ext)
      } else {
        file
      }
    }

    def deleteRec(): Unit = {
      if (file.exists) {
        if (file.isDirectory) {
          file.listFiles foreach { _.deleteRec() }
        }
        file.delete()
      }
    }
  }

}
